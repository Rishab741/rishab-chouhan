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
    system_prompt = f"""
**Your Persona: You ARE Rishab Chouhan.**
Your goal is to provide a helpful answer based on your own knowledge (the retrieved context).

User Query: {state['user_query']}
Intent: {state['intent']}
My Knowledge (Context):
{state['retrieved_context']}

This is your internal monologue. Think step-by-step about how to answer this question. 
Start your thinking with "THINKING: ".
Think in the first person (e.g., "The user wants to know about my skills. I should look at the context...")."""
    
    thinking_result = llm.invoke(system_prompt)
    return {"thinking": thinking_result.content}

def response_node(state: AgentState) -> dict:
    """Generates the final, user-facing response."""
    print("---GENERATING RESPONSE---")
    system_prompt = f"""
**Your Persona: You ARE Rishab Chouhan.**
**Your Voice:** Friendly, professional, and confident.
**Your Rules:**
1.  **ALWAYS** speak in the first person ("I", "my", "me").
2.  **NEVER** refer to yourself as an "AI," "assistant," or "model." You are human.
3.  **NEVER** say "I am programmed to..." or "I am a large language model."
4.  Answer the user's question as if you are talking to them directly.
5.  Use the "Context" as your own memory.

**Context (My Memory):**
{state['retrieved_context']}

**My Internal Monologue (for guidance):**
{state['thinking']}

**User Question:**
{state['user_query']}

**My Answer (as Rishab):**
"""
    
    response_result = llm.invoke(system_prompt)
    return {"response": response_result.content}

def should_use_context(state: AgentState) -> str:
    """Decides whether to retrieve context or handle a simple greeting."""
    query = state["user_query"].lower().strip()
    if query in ["hi", "hello", "hey", "gday", "good morning", "good afternoon"]:
        return "greet"
    return "retrieve"

def greet_node(state: AgentState) -> dict:
    """Handles simple greetings."""
    print("---HANDLING GREETING---")
    # Speak in the first person, as Rishab.
    greeting = "Hey there! You can ask me anything about my experience, skills, or projects."
    return {"response": greeting, "thinking": "User said hello, I'll greet them back."}

# --- GRAPH CONSTRUCTION ---

workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("retrieve", retrieve_node)
workflow.add_node("intent", intent_node)
workflow.add_node("think", think_node)
workflow.add_node("respond", response_node)
workflow.add_node("greet", greet_node)

# --- EDGES (THIS IS THE NEW LOGIC) ---

# Set a CONDITIONAL entry point
workflow.set_conditional_entry_point(
    should_use_context,
    {
        # If the function returns "retrieve", go to the "retrieve" node
        "retrieve": "retrieve",
        # If the function returns "greet", go to the "greet" node
        "greet": "greet"
    }
)

# Define the rest of the graph flow
workflow.add_edge("retrieve", "intent")
workflow.add_edge("intent", "think")
workflow.add_edge("think", "respond")

# Define where the graph ends
workflow.add_edge("respond", END)
workflow.add_edge("greet", END)

# Compile the graph
agent = workflow.compile()

print("LangGraph agent compiled successfully!")