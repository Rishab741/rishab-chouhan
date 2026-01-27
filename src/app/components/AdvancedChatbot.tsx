'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AdvancedChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<string[]>([]);
  const isClosingRef = useRef(false); // Track intentional closures

  // Generate unique IDs
  const generateId = useCallback(() => 
    `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, 
  []);

  // Add message helper
  const addMessage = useCallback((message: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: generateId() }]);
  }, [generateId]);

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    // Close existing connection
    if (socketRef.current) {
      isClosingRef.current = true; // Mark as intentional closure
      socketRef.current.close();
      socketRef.current = null;
    }

    // Clear any pending reconnect
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setConnectionStatus('connecting');
    console.log('🔄 Attempting WebSocket connection...');

    try {
      isClosingRef.current = false; // Reset closure flag
      const wsUrl = 'wss://rishab-chouhan.onrender.com/ws/chat';
      const socket = new WebSocket(wsUrl);
      
      // Set a connection timeout
      const connectionTimeout = setTimeout(() => {
        if (socket.readyState !== WebSocket.OPEN) {
          console.error('⏱️ Connection timeout');
          socket.close();
          setConnectionStatus('disconnected');
          addMessage({
            role: 'assistant',
            content: "Connection timeout. The server might be sleeping (Render free tier). Please wait 30 seconds and try again.",
            timestamp: new Date()
          });
        }
      }, 15000); // 15 second timeout

      socket.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('✅ WebSocket connected');
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        
        // Send any queued messages
        while (messageQueueRef.current.length > 0) {
          const queuedMsg = messageQueueRef.current.shift();
          if (queuedMsg && socket.readyState === WebSocket.OPEN) {
            socket.send(queuedMsg);
          }
        }
      };

      socket.onmessage = (event) => {
        console.log('📨 Received:', event.data);
        try {
          const data = JSON.parse(event.data);
          addMessage({
            role: 'assistant',
            content: data.response || data.message || 'Received empty response',
            timestamp: new Date()
          });
        } catch (e) {
          console.error('Failed to parse message:', e);
          addMessage({
            role: 'assistant',
            content: event.data,
            timestamp: new Date()
          });
        }
        setLoading(false);
      };

      socket.onerror = (error) => {
        clearTimeout(connectionTimeout);
        // Only log error if it wasn't an intentional closure
        if (!isClosingRef.current) {
          console.error('❌ WebSocket error:', error);
          setConnectionStatus('disconnected');
        }
      };

      socket.onclose = (event) => {
        clearTimeout(connectionTimeout);
        
        // Only log and handle if it wasn't an intentional closure
        if (!isClosingRef.current) {
          console.log('🔌 WebSocket closed:', event.code, event.reason);
          setConnectionStatus('disconnected');
          socketRef.current = null;

          // Attempt to reconnect if chat is still open
          if (isOpen && reconnectAttempts < 3) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
            console.log(`🔄 Reconnecting in ${delay}ms...`);
            reconnectTimeoutRef.current = setTimeout(() => {
              setReconnectAttempts(prev => prev + 1);
              connectWebSocket();
            }, delay);
          }
        } else {
          console.log('✅ WebSocket closed intentionally');
          socketRef.current = null;
        }
      };

      socketRef.current = socket;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionStatus('disconnected');
      addMessage({
        role: 'assistant',
        content: "Failed to connect. Please check the server URL and try again.",
        timestamp: new Date()
      });
    }
  }, [isOpen, reconnectAttempts, addMessage]);

  // Connect when chat opens
  useEffect(() => {
    if (isOpen) {
      connectWebSocket();
    } else {
      // Clean up when closing - mark as intentional
      isClosingRef.current = true;
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      setReconnectAttempts(0);
      setConnectionStatus('disconnected');
    }

    return () => {
      isClosingRef.current = true;
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isOpen, connectWebSocket]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    setLoading(true);

    const payload = JSON.stringify({
      text: userMessage,
      conversation_id: 'default'
    });

    // Send via WebSocket or queue
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('📤 Sending:', payload);
      socketRef.current.send(payload);
    } else {
      console.log('⏳ Queueing message, connection not ready');
      messageQueueRef.current.push(payload);
      
      addMessage({
        role: 'assistant',
        content: "Connecting to server... Your message will be sent once connected. (Render free tier servers may take 30-60s to wake up)",
        timestamp: new Date()
      });

      // Try to reconnect
      if (connectionStatus === 'disconnected') {
        connectWebSocket();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
                        {reconnectAttempts > 0 && ` (${reconnectAttempts}/3)`}
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
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="w-12 h-12 text-indigo-500 mb-3" />
                  <p className="text-zinc-400 text-sm">Start a conversation</p>
                  <p className="text-zinc-600 text-xs mt-1">Note: Server may take 30-60s to wake up</p>
                </div>
              )}
              
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-zinc-800/50 text-zinc-100 border border-zinc-700/50'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0a0a0a] border-t border-white/5">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={connectionStatus === 'connected' ? "Type a message..." : "Waiting for connection..."}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              
              {connectionStatus === 'disconnected' && messages.length === 0 && (
                <button
                  onClick={connectWebSocket}
                  className="w-full mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Retry Connection
                </button>
              )}
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