import os
import json
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import the agent - UPDATED FOR RENDER
try:
    # Try relative import first (for local development)
    from .langgraph_agent import agent
except ImportError:
    try:
        # Fallback for Render deployment
        from langgraph_agent import agent
    except ImportError as e:
        print(f"Error importing agent: {e}")
        agent = None 

app = FastAPI(title="Virtual Rishab AI Assistant")

# CORS configuration - UPDATED FOR RENDER
# Allow multiple origins including Render and local development
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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

@app.get("/")
def root():
    """Root endpoint that returns basic API info."""
    return {
        "status": "healthy",
        "service": "Virtual Rishab AI Assistant",
        "message": "API is running successfully",
        "endpoints": {
            "health": "/health",
            "chat": "/api/chat",
            "websocket": "/ws/chat"
        }
    }

@app.get("/health")
def health_check():
    """A comprehensive health check endpoint for Render."""
    return {
        "status": "healthy",
        "service": "Virtual Rishab AI Assistant",
        "agent_initialized": agent is not None,
        "environment": "production" if os.getenv('RENDER') else "development"
    }

# Server startup - ADDED FOR RENDER
if __name__ == "__main__":
    import uvicorn
    
    # Get port from environment variable (Render provides this)
    port = int(os.environ.get("PORT", 8000))
    
    # Start the server
    uvicorn.run(
        "main:app",  # Updated for Render - assumes this file is main.py
        host="0.0.0.0",  # Important: listen on all interfaces
        port=port,
        reload=False  # Disable reload in production
    )