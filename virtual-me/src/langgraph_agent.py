import os
import threading
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode

# Import updated calendar tools
from google_calender_tools import list_available_slots, request_meeting_approval

# --- LAZY INITIALIZATION ---
vector_store = None
llm = None
agent = None

# Semaphore ensures only one LLM call runs at a time, preventing
# concurrent retries from exhausting the free-tier burst limit.
_llm_semaphore = threading.Semaphore(1)

def initialize_components():
    global vector_store, llm
    if llm is not None:
        return

    google_api_key = os.getenv("GOOGLE_API_KEY")
    pinecone_api_key = os.getenv("PINECONE_API_KEY")
    pinecone_index = os.getenv("PINECONE_INDEX")

    print(f"🔧 INIT | GOOGLE_API_KEY present: {bool(google_api_key)} prefix={google_api_key[:8] if google_api_key else 'MISSING'}")
    print(f"🔧 INIT | PINECONE_API_KEY present: {bool(pinecone_api_key)}")
    print(f"🔧 INIT | PINECONE_INDEX: {pinecone_index}")

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=google_api_key,
        transport="rest",
    )

    vector_store = PineconeVectorStore(
        index_name=pinecone_index,
        embedding=embeddings,
        pinecone_api_key=pinecone_api_key
    )

    tools = [retrieve_context, list_available_slots, request_meeting_approval]
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        api_key=os.getenv("OPENAI_API_KEY"),
        temperature=0.7,
        max_retries=2,
    ).bind_tools(tools)
    print("✅ INIT | All components initialized successfully")

@tool
def retrieve_context(query: str) -> str:
    """Retrieve relevant information about Rishab's portfolio, experience, skills, and projects.
    Use this tool to answer questions about work history, tech stack, and achievements.
    """
    initialize_components()
    try:
        print(f"DEBUG: Searching Pinecone for: {query}")
        results = vector_store.similarity_search(query, k=3)
        context = "\n\n".join([doc.page_content for doc in results])
        return f"RETRIEVED CONTEXT:\n{context}"
    except Exception as e:
        print(f"DEBUG ERROR: {str(e)}")
        return f"Error retrieving context: {str(e)}"

class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    user_query: str
    retrieved_context: str
    thinking: str
    response: str

# --- REFINED SYSTEM PROMPT ---
SYSTEM_PROMPT = """You are Rishab Chouhan's AI assistant. Your role is to help visitors learn about Rishab's background and coordinate meeting requests.

ABOUT RISHAB:
- Full-Stack Software Engineer with 2+ years experience based in Sydney, Australia.
- Expertise includes: React, TypeScript, Node.js, Python, Blockchain (Solidity), and AI integration.
- Notable projects: PyroPredict AI (wildfire prediction) and healthcare workflow automation.

MEETING SCHEDULING PROTOCOL:
When a user wants to schedule a meeting, you must follow these steps:
1. **Gather Info**: Ask for their email address and a brief reason (context) for the meeting if they haven't provided it.
2. **Check Availability**: Use `list_available_slots` with a date (format: YYYY-MM-DD).
3. **Send Request**: Once a time is chosen, use `request_meeting_approval`. 
   - You MUST pass the `meeting_context` which summarizes the visitor's goal.
4. **Manage Expectations**: Inform the user that a "Tentative Request" has been added to Rishab's calendar. Explain that he will review the context and finalize the booking by accepting it.

IMPORTANT GUIDELINES:
- ALWAYS use `retrieve_context` when asked about Rishab's skills, experience, or projects.
- Be professional, technical, and friendly.
- If a tool fails, explain the error clearly and offer to try a different date or provide contact info.
"""

def think_node(state: AgentState) -> dict:
    """Main reasoning node - decides what to do next"""
    initialize_components()

    messages = list(state["messages"])

    if not any(isinstance(m, SystemMessage) for m in messages):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages

    if len(messages) > 21:
        messages = [messages[0]] + messages[-20:]

    print(f"🤔 THINK | Invoking LLM with {len(messages)} messages, model=gpt-4o-mini")
    try:
        with _llm_semaphore:
            ai_response = llm.invoke(messages)
        print(f"✅ THINK | LLM responded, has_tool_calls={bool(getattr(ai_response, 'tool_calls', None))}")
    except Exception as e:
        print(f"❌ THINK | LLM call failed: type={type(e).__name__} module={type(e).__module__}")
        print(f"❌ THINK | Error detail: {e}")
        if hasattr(e, 'grpc_status_code'):
            print(f"❌ THINK | gRPC status: {e.grpc_status_code}")
        if hasattr(e, 'errors'):
            print(f"❌ THINK | API errors: {e.errors}")
        raise

    return {
        "messages": [ai_response],
        "thinking": "Analyzing request..."
    }

def response_node(state: AgentState) -> dict:
    """Generate final response from conversation and add frontend triggers"""
    messages = state["messages"]
    last_message = messages[-1]
    
    response_text = last_message.content if isinstance(last_message, AIMessage) else "I apologize, but I encountered an error."
    
    # Add trigger for frontend meeting UI
    if any(keyword in response_text.lower() for keyword in ['meeting', 'schedule', 'calendar', 'available']):
        response_text += "\n\n[TRIGGER:MEETING_FLOW]"
    
    return {
        "response": response_text,
        "thinking": "Response generated"
    }

def should_continue(state: AgentState) -> str:
    """Decide whether to use tools or generate response"""
    messages = state["messages"]
    last_message = messages[-1]
    
    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        return "tools"
    
    return "respond"

def build_agent_graph():
    """Build the LangGraph workflow"""
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("think", think_node)
    workflow.add_node("respond", response_node)
    workflow.add_node(
        "tools", 
        ToolNode([retrieve_context, list_available_slots, request_meeting_approval])
    )
    
    # Set entry point
    workflow.set_entry_point("think")
    
    # Add conditional edges
    workflow.add_conditional_edges(
        "think",
        should_continue,
        {
            "tools": "tools",
            "respond": "respond"
        }
    )
    
    # Tool node goes back to think
    workflow.add_edge("tools", "think")
    workflow.add_edge("respond", END)
    
    return workflow.compile()

def get_agent():
    """Get or create the agent instance"""
    global agent
    if agent is None:
        agent = build_agent_graph()
    return agent

# For direct script debugging
if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    
    test_agent = get_agent()
    result = test_agent.invoke({
        "messages": [HumanMessage(content="I want to discuss PyroPredict with Rishab. My email is test@example.com")]
    })
    
    print("Response:", result.get("response"))