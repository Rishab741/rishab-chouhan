'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  context?: string;
  timestamp: Date;
}

export default function AdvancedChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // 1. FIX: Helper function to generate truly unique IDs
  // Prevents the "Encountered two children with the same key" error
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Initialize WebSocket connection
  useEffect(() => {
    if (isOpen) {
      
      // 2. FIX: Robust URL Logic for Codespaces
      let wsUrl;
      const hostname = window.location.hostname;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Local Machine
        wsUrl = 'ws://localhost:8000/ws/chat';
      } else if (hostname.includes('github.dev') || hostname.includes('gitpod.io')) {
        // Cloud Codespaces
        // We must use WSS and replace the frontend port (likely 3000) with backend (8000)
        // This regex finds the port number in the URL (e.g., -3000) and replaces it
        let backendHost = hostname.replace(/-\d+(?=\.app\.github\.dev)/, '-8000');
        
        // Fallback: if regex didn't catch it, try direct string replacement
        if (backendHost === hostname) {
            backendHost = hostname.replace('3000', '8000');
        }
        
        wsUrl = `${protocol}//${backendHost}/ws/chat`;
      } else {
        // Production Deployment
        wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://your-production-backend.onrender.com/ws/chat';
      }

      console.log("🚀 Attempting connection to:", wsUrl);

      try {
        socketRef.current = new WebSocket(wsUrl);
      } catch (e) {
        console.error("Socket creation failed", e);
      }
      
      if (socketRef.current) {
        socketRef.current.onopen = () => {
          console.log("WebSocket connection established.");
        };

        socketRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          addMessage({
            id: generateId(), // Use unique ID
            role: 'assistant',
            content: data.response,
            thinking: data.thinking, 
            timestamp: new Date()
          });
          setLoading(false);
        };

        socketRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          // Only show error message to user if we aren't just closing
          if (socketRef.current?.readyState !== WebSocket.CLOSED) {
             addMessage({
                id: generateId(),
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting. Please ensure Port 8000 is Public.",
                timestamp: new Date()
            });
            setLoading(false);
          }
        };
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [isOpen]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    addMessage({
      id: generateId(), // Use unique ID
      role: 'user',
      content: input,
      timestamp: new Date()
    });

    setLoading(true);

    // Send via WebSocket
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        text: input,
        conversation_id: 'default'
      }));
    } else {
        addMessage({
            id: generateId(),
            role: 'assistant',
            content: "I'm not connected right now. Please try closing and reopening the chat.",
            timestamp: new Date()
        });
        setLoading(false);
    }

    setInput('');
  };

  return (
    <div className="z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 transform ${
          isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100 hover:scale-110'
        }`}
        aria-label="Open chat"
      >
        <Bot className="w-8 h-8" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-0 right-0 sm:m-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 w-full sm:max-w-md h-[85vh] sm:h-[75vh] flex flex-col transition-all duration-700 ${
        isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-95'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-xl">Virtual Rishab</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
              }`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && <div className="text-center text-sm text-gray-500">Thinking...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={e => { e.preventDefault(); handleSend(); }}
          className="p-6 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about my experience..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}