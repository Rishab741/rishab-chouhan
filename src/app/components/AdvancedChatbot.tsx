'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, Terminal, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper to generate unique IDs (Replaces crypto.randomUUID) ---
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string; // We still receive it, just won't show it
  context?: string;
  timestamp: Date;
}

export default function AdvancedChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // 1. FIX: Helper function to generate truly unique IDs
  // Prevents the "Encountered two children with the same key" error
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // 1. WebSocket Connection Logic
  useEffect(() => {
    if (isOpen) {
      // Use the production WebSocket URL when deployed
      const wsUrl = process.env.NODE_ENV === 'production'
        ? 'wss://your-production-backend.onrender.com/ws/chat' // Replace with your deployed backend URL
        : 'ws://localhost:8000/ws/chat';
      
      socketRef.current = new WebSocket(wsUrl);
      
      socketRef.current.onopen = () => {
        console.log("WebSocket connection established.");
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        addMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          thinking: data.thinking, // Still storing it, just not displaying
          timestamp: new Date()
        });
        setLoading(false);
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        addMessage({
            id: Date.now().toString(),
            role: 'assistant',
            content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.",
            timestamp: new Date()
        });
        setLoading(false);
      };
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    addMessage(userMsg);
    setInput('');
    setLoading(true);

    // Send via WebSocket
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        text: input,
        conversation_id: 'default'
      }));
    } else {
        addMessage({
            id: Date.now().toString(),
            role: 'assistant',
            content: "I'm not connected right now. Please try opening the chat again.",
            timestamp: new Date()
        });
        setLoading(false);
    }

    setInput('');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end pointer-events-none font-sans">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="pointer-events-auto mb-4 w-[90vw] sm:w-[380px] h-[600px] max-h-[80vh] flex flex-col bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm tracking-wide">AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                        connectionStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                        connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                    }`} />
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                        {connectionStatus}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
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
                
                {/* THIS BLOCK IS NOW REMOVED:
                
                  {msg.thinking && (
                    <p className="text-xs opacity-60 mt-2 italic">{msg.thinking}</p>
                  )}
                
                */}

              </div>
            </div>
          ))}
          {loading && <div className="text-center text-sm text-gray-500">Thinking...</div>}
          <div ref={messagesEndRef} />
        </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0a0a0a] border-t border-white/5">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-900/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading || connectionStatus !== 'connected'}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 border border-white/10 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-indigo-600 opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="relative z-10">
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative z-10">
              <Sparkles className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

    </div>
  );
}