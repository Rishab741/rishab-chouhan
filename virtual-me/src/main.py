import os
import sys
import json
from pathlib import Path

# Add src directory to Python path
src_path = Path(__file__).parent
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage

# Load environment variables
load_dotenv()

# Import agent
from langgraph_agent import get_agent

app = FastAPI(title="Virtual Rishab AI Assistant")

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,http://localhost:5174").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: list = [] 

class ChatResponse(BaseModel):
    response: str
    thinking: str
    history: list
    action: str = None  # For triggering meeting flow

def get_agent_safe():
    """Safely get agent instance with error handling"""
    try:
        return get_agent()
    except Exception as e:
        print(f"❌ Error getting agent: {e}")
        import traceback
        traceback.print_exc()
        return None

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """REST endpoint for chat"""
    agent = get_agent_safe()
    if not agent:
        raise HTTPException(status_code=500, detail="Agent not initialized.")
    
    initial_state = {
        "messages": request.history + [HumanMessage(content=request.message)],
        "user_query": request.message,
    }
    
    try:
        result = agent.invoke(initial_state)
        
        # Check if response triggers meeting flow
        response_text = result.get("response", "Error")
        action = None
        if "[TRIGGER:MEETING_FLOW]" in response_text:
            action = "suggest_meeting"
            response_text = response_text.replace("[TRIGGER:MEETING_FLOW]", "").strip()
        
        return ChatResponse(
            response=response_text,
            thinking=result.get("thinking", ""),
            history=result.get("messages", []),
            action=action
        )
    except Exception as e:
        print(f"❌ Error in chat endpoint: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time chat"""
    await websocket.accept()
    print("✅ WebSocket connection accepted")
    
    agent = get_agent_safe()
    if not agent:
        try:
            await websocket.send_json({
                "error": "Agent not initialized. Check server logs.",
                "type": "error"
            })
            await websocket.close()
        except Exception:
            pass
        return

    session_messages = []
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            user_text = message_data.get("text", "")
            
            print(f"📨 Received: {user_text}")
            
            # Build initial state
            initial_state = {
                "messages": session_messages + [HumanMessage(content=user_text)],
                "user_query": user_text,
            }
            
            try:
                # Invoke agent
                result = agent.invoke(initial_state)
                session_messages = result.get("messages", [])
                
                response_text = result.get("response", "I apologize, but I encountered an error.")
                
                # Check for meeting flow trigger
                action = None
                if "[TRIGGER:MEETING_FLOW]" in response_text:
                    action = "suggest_meeting"
                    response_text = response_text.replace("[TRIGGER:MEETING_FLOW]", "").strip()
                
                # Send response
                response_payload = {
                    "response": response_text,
                    "thinking": result.get("thinking", ""),
                    "type": "message"
                }
                
                if action:
                    response_payload["action"] = action
                
                await websocket.send_json(response_payload)
                print(f"📤 Sent: {response_text[:100]}...")
                
            except Exception as e:
                print(f"❌ Error invoking agent: {e}")
                import traceback
                traceback.print_exc()
                
                await websocket.send_json({
                    "response": "I apologize, but I encountered an error processing your request. Please try again.",
                    "error": str(e),
                    "type": "error"
                })
            
    except WebSocketDisconnect:
        print("ℹ️ Client disconnected normally.")
    except Exception as e:
        print(f"⚠️ WebSocket Error: {e}")
        import traceback
        traceback.print_exc()
        try:
            await websocket.send_json({"error": str(e), "type": "error"})
        except RuntimeError:
            print("🚫 Could not send error: connection already closed.")

@app.get("/health")
def health_check():
    """Health check endpoint"""
    agent = get_agent_safe()
    status = "healthy" if agent else "degraded"
    
    return {
        "status": status,
        "pinecone_index": os.getenv("PINECONE_INDEX"),
        "google_api_configured": bool(os.getenv("GOOGLE_API_KEY")),
        "calendar_configured": bool(os.getenv("GCP_SERVICE_ACCOUNT_JSON"))
    }

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Virtual Rishab AI Assistant API",
        "version": "1.0.0",
        "endpoints": {
            "websocket": "/ws/chat",
            "rest": "/api/chat",
            "health": "/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)