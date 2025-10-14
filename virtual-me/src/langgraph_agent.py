import os
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain.agents import tool
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone as PineconeClient

# --- INITIALIZATION ---

# Initialize Pinecone client
pinecone_api_key = os.getenv("PINECONE_API_KEY")
pinecone_env = os.getenv("PINECONE_ENVIRONMENT")
pinecone_index_name = os.getenv("PINECONE_INDEX")
pinecone = PineconeClient(api_key=pinecone_api_key, environment=pinecone_env)

# Initialize embeddings model
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

# Initialize LangChain vector store with Pinecone
vector_store = PineconeVectorStore(
    index_name=pinecone_index_name, 
    embedding=embeddings
)

# Initialize LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-lite-001",
    temperature=0.7
    # The API key is automatically read from the GOOGLE_API_KEY environment variable
)

# --- AGENT STATE DEFINITION ---

class AgentState(TypedDict):
    messages: Annotated[List, add_messages]
    user_query: str
    retrieved_context: str
    intent: str
    thinking: str
    response: str

# --- TOOLS ---

@tool
def retrieve_context(query: str) -> str:
    """Retrieve relevant portfolio context from the vector database."""
    results = vector_store.similarity_search(query, k=5)
    return "\n".join([doc.page_content for doc in results])

@tool
def analyze_intent(query: str) -> str:
    """Determine the user's intent from their question to categorize it."""
    intents = {
        "experience": ["experience", "worked", "job", "role", "company"],
        "skills": ["skills", "know", "proficient", "technology", "tech"],
        "projects": ["project", "built", "developed", "created"],
        "general": ["who", "tell", "about", "background", "contact", "email", "reach"]
    }
    
    query_lower = query.lower()
    for intent, keywords in intents.items():
        if any(keyword in query_lower for keyword in keywords):
            return intent
    return "general"

# --- NODE FUNCTIONS ---

def retrieve_node(state: AgentState) -> dict:
    """Retrieves relevant documents from the vector store."""
    print("---RETRIEVING CONTEXT---")
    context = retrieve_context.invoke({"query": state["user_query"]})
    return {"retrieved_context": context}

def intent_node(state: AgentState) -> dict:
    """Analyzes the user's intent."""
    print("---ANALYZING INTENT---")
    intent = analyze_intent.invoke({"query": state["user_query"]})
    return {"intent": intent}

def think_node(state: AgentState) -> dict:
    """The LLM thinks about how to construct the response."""
    print("---THINKING---")
    system_prompt = f"""You are a virtual AI assistant representing Rishab Chouhan, a versatile software engineer. 
    
User Query: {state['user_query']}
Intent: {state['intent']}
Retrieved Context:
{state['retrieved_context']}

Think step-by-step about how to answer this question. Your thinking should be a concise plan that sounds natural and represents Rishab accurately.
Start your thinking with "THINKING: " as a prefix."""
    
    thinking_result = llm.invoke(system_prompt)
    return {"thinking": thinking_result.content}

def response_node(state: AgentState) -> dict:
    """Generates the final, user-facing response."""
    print("---GENERATING RESPONSE---")
    system_prompt = f"""You are Rishab Chouhan, a versatile software engineer with 2+ years of experience.
    
Based on the following context about your background, answer the user's question in the first person.
Be friendly, professional, and concise.

Context: {state['retrieved_context']}
Previous Thinking: {state['thinking']}

User Question: {state['user_query']}

Provide a natural, conversational response as if you're speaking directly to the user. Do not repeat the question."""
    
    response_result = llm.invoke(system_prompt)
    return {"response": response_result.content}

def should_use_context(state: AgentState) -> str:
    """Decides whether to retrieve context or handle a simple greeting."""
    if state["user_query"].lower().strip() in ["hi", "hello", "hey", "gday"]:
        return "greet"
    return "retrieve"

def greet_node(state: AgentState) -> dict:
    """Handles simple greetings."""
    print("---HANDLING GREETING---")
    greeting = "Hi! I'm Rishab's AI assistant. You can ask me anything about his experience, skills, projects, or background!"
    return {"response": greeting}

# --- GRAPH CONSTRUCTION ---

workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("retrieve", retrieve_node)
workflow.add_node("intent", intent_node)
workflow.add_node("think", think_node)
workflow.add_node("respond", response_node)
workflow.add_node("greet", greet_node)

# Define edges
workflow.set_entry_point("retrieve") # Start by retrieving context
workflow.add_edge("retrieve", "intent")
workflow.add_edge("intent", "think")
workflow.add_edge("think", "respond")
workflow.add_edge("respond", END)

# Define conditional entry point (though retrieve is now the main start)
# This logic could be re-integrated if a pre-retrieval check is needed.
# For now, we simplify the flow to always retrieve first.

# Compile the graph
agent = workflow.compile()

print("LangGraph agent compiled successfully!")
