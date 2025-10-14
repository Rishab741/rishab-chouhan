# agent_state.py
from typing import TypedDict, Annotated, List
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[List, add_messages]
    user_query: str
    retrieved_context: str
    intent: str  # "experience", "skills", "projects", "general"
    thinking: str
    response: str
    conversation_history: List[dict]