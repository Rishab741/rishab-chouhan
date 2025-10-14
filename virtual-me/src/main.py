import os
import json
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Correctly import the agent using a relative import
try:
    from .langgraph_agent import agent
except ImportError as e:
    print(f"Error importing agent: {e}")
    agent = None 

app = FastAPI(title="Virtual Rishab AI Assistant")

# CORS configuration to allow your frontend to connect
cors_origin = os.getenv("CORS_ORIGIN", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[cors_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request and response validation
class ChatRequest(BaseModel):
    message: str
    conversation_id: str = "default"

class ChatResponse(BaseModel):
    response: str
    thinking: str
    retrieved_context: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Processes a user message via HTTP and returns the AI's response."""
    if not agent:
        raise HTTPException(status_code=500, detail="Agent not initialized correctly.")
    
    try:
        # Initialize the state for the LangGraph agent
        initial_state = {
            "messages": [("user", request.message)],
            "user_query": request.message,
        }
        
        # Run the agent with the initial state
        result = agent.invoke(initial_state)
        
        # Ensure all expected keys are present, providing defaults if not
        return ChatResponse(
            response=result.get("response", "Sorry, I encountered an issue."),
            thinking=result.get("thinking", ""),
            retrieved_context=result.get("retrieved_context", "")
        )
    except Exception as e:
        print(f"Error during agent invocation: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    """Handles real-time chat communication via WebSocket."""
    await websocket.accept()
    if not agent:
        await websocket.send_json({"error": "Agent not initialized", "type": "error"})
        await websocket.close()
        return

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            initial_state = {
                "messages": [("user", message["text"])],
                "user_query": message["text"],
            }
            
            result = agent.invoke(initial_state)
            
            # Send the response back to the client
            await websocket.send_json({
                "response": result.get("response", "Sorry, an error occurred."),
                "thinking": result.get("thinking", ""),
                "type": "message"
            })
    except Exception as e:
        print(f"WebSocket Error: {e}")
        await websocket.send_json({"error": str(e), "type": "error"})

@app.get("/health")
def health_check():
    """A simple endpoint to confirm the server is running."""
    return {"status": "ok"}
