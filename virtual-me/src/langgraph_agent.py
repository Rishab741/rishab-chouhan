import os
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain.agents import tool

# --- LAZY INITIALIZATION ---

# Initialize variables as None
pinecone = None
embeddings = None
vector_store = None
llm = None
agent = None

def initialize_components():
    """Initialize all components only when needed"""
    global pinecone, embeddings, vector_store, llm, agent
    
    # Only initialize if not already initialized
    if pinecone is not None:
        return
    
    # Check for required environment variables
    pinecone_api_key = os.getenv("PINECONE_API_KEY")
    pinecone_env = os.getenv("PINECONE_ENVIRONMENT") 
    pinecone_index_name = os.getenv("PINECONE_INDEX")
    google_api_key = os.getenv("GOOGLE_API_KEY")
    
    if not all([pinecone_api_key, pinecone_env, pinecone_index_name, google_api_key]):
        missing = []
        if not pinecone_api_key: missing.append("PINECONE_API_KEY")
        if not pinecone_env: missing.append("PINECONE_ENVIRONMENT")
        if not pinecone_index_name: missing.append("PINECONE_INDEX")
        if not google_api_key: missing.append("GOOGLE_API_KEY")
        raise ValueError(f"Missing environment variables: {', '.join(missing)}")
    
    # Initialize Pinecone client
    from pinecone import Pinecone as PineconeClient
    pinecone = PineconeClient(api_key=pinecone_api_key, environment=pinecone_env)

    # Initialize embeddings model
    from langchain_google_genai import GoogleGenerativeAIEmbeddings
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=google_api_key
    )

    # Initialize LangChain vector store with Pinecone
    from langchain_pinecone import PineconeVectorStore
    vector_store = PineconeVectorStore(
        index_name=pinecone_index_name, 
        embedding=embeddings
    )

    # Initialize LLM
    from langchain_google_genai import ChatGoogleGenerativeAI
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-lite-001",
        temperature=0.7,
        google_api_key=google_api_key
    )

def get_agent():
    """Get or create the agent instance"""
    global agent
    if agent is None:
        initialize_components()
        # Build the graph (your existing graph code)
        agent = build_agent_graph()
    return agent

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
    initialize_components()  # Ensure components are initialized
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
    initialize_components()  # Ensure components are initialized
    
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
    initialize_components()  # Ensure components are initialized
    
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
    greeting = "Hey there! You can ask me anything about my experience, skills, or projects."
    return {"response": greeting, "thinking": "User said hello, I'll greet them back."}

# --- GRAPH CONSTRUCTION ---
def build_agent_graph():
    """Build and return the compiled agent"""
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("retrieve", retrieve_node)
    workflow.add_node("intent", intent_node)
    workflow.add_node("think", think_node)
    workflow.add_node("respond", response_node)
    workflow.add_node("greet", greet_node)

    # Set a CONDITIONAL entry point
    workflow.set_conditional_entry_point(
        should_use_context,
        {
            "retrieve": "retrieve",
            "greet": "greet"
        }
    )

    # Define the rest of the graph flow
    workflow.add_edge("retrieve", "intent")
    workflow.add_edge("intent", "think")
    workflow.add_edge("think", "respond")
    workflow.add_edge("respond", END)
    workflow.add_edge("greet", END)

    # Compile the graph
    compiled_agent = workflow.compile()
    print("LangGraph agent compiled successfully!")
    return compiled_agent

# Initialize agent when module is imported (optional - or use get_agent() when needed)
try:
    agent = get_agent()
except Exception as e:
    print(f"Agent initialization failed: {e}")
    agent = None