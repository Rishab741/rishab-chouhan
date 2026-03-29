'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Sparkles, Loader2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action?: string;
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
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wakeUpNoticeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<string[]>([]);
  const isClosingRef = useRef(false);
  // Refs to avoid stale closures inside WebSocket callbacks
  const isOpenRef = useRef(isOpen);
  const reconnectAttemptsRef = useRef(0);
  const connectWebSocketRef = useRef<() => void>(() => {});

  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  const generateId = useCallback(() =>
    `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  []);

  const addMessage = useCallback((message: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: generateId() }]);
  }, [generateId]);

  const clearConnectionTimers = useCallback(() => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
    if (wakeUpNoticeTimeoutRef.current) {
      clearTimeout(wakeUpNoticeTimeoutRef.current);
      wakeUpNoticeTimeoutRef.current = null;
    }
  }, []);

  // connectWebSocket has no deps that change — all mutable state accessed via refs
  const connectWebSocket = useCallback(() => {
    if (socketRef.current) {
      isClosingRef.current = true;
      socketRef.current.close();
      socketRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    clearConnectionTimers();

    setConnectionStatus('connecting');

    try {
      isClosingRef.current = false;
      const wsUrl = 'wss://rishab-chouhan.onrender.com/ws/chat';
      const socket = new WebSocket(wsUrl);

      // Only show the wake-up notice once per open session
      wakeUpNoticeTimeoutRef.current = setTimeout(() => {
        if (socket.readyState !== WebSocket.OPEN) {
          addMessage({
            role: 'assistant',
            content: "The server is waking up from sleep (Render free tier). This can take up to 60 seconds — please hang tight!",
            timestamp: new Date()
          });
        }
      }, 5000);

      connectionTimeoutRef.current = setTimeout(() => {
        clearConnectionTimers();
        if (socket.readyState !== WebSocket.OPEN) {
          socket.close();
          setConnectionStatus('disconnected');
          addMessage({
            role: 'assistant',
            content: "Connection timed out. The server may still be starting — please try again in a moment.",
            timestamp: new Date()
          });
        }
      }, 65000);

      socket.onopen = () => {
        clearConnectionTimers();
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        setReconnectAttempts(0);
        while (messageQueueRef.current.length > 0) {
          const queuedMsg = messageQueueRef.current.shift();
          if (queuedMsg && socket.readyState === WebSocket.OPEN) {
            socket.send(queuedMsg);
          }
        }
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'error') {
            addMessage({
              role: 'assistant',
              content: data.response || "I encountered an error. Please try again.",
              timestamp: new Date()
            });
          } else {
            const hasAction = data.action === 'suggest_meeting';
            addMessage({
              role: 'assistant',
              content: data.response || 'I apologize, but I did not receive a proper response.',
              timestamp: new Date(),
              action: hasAction ? 'suggest_meeting' : undefined
            });
          }
        } catch (e) {
          addMessage({ role: 'assistant', content: event.data, timestamp: new Date() });
        }
        setLoading(false);
      };

      socket.onerror = () => {
        clearConnectionTimers();
        if (!isClosingRef.current) {
          setConnectionStatus('disconnected');
        }
      };

      socket.onclose = (event) => {
        clearConnectionTimers();
        if (!isClosingRef.current) {
          console.log('🔌 WebSocket closed:', event.code);
          setConnectionStatus('disconnected');
          if (isOpenRef.current && reconnectAttemptsRef.current < 3) {
            reconnectAttemptsRef.current += 1;
            setReconnectAttempts(reconnectAttemptsRef.current);
            reconnectTimeoutRef.current = setTimeout(() => {
              connectWebSocketRef.current();
            }, 3000);
          }
        }
      };

      socketRef.current = socket;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionStatus('disconnected');
    }
  }, [addMessage, clearConnectionTimers]);

  // Keep the ref in sync so onclose can call the latest version without being a dep
  useEffect(() => {
    connectWebSocketRef.current = connectWebSocket;
  }, [connectWebSocket]);

  // Only depends on isOpen — no more infinite loop from reconnectAttempts
  useEffect(() => {
    if (isOpen) {
      reconnectAttemptsRef.current = 0;
      setReconnectAttempts(0);
      connectWebSocket();
    } else {
      isClosingRef.current = true;
      clearConnectionTimers();
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      reconnectAttemptsRef.current = 0;
      setReconnectAttempts(0);
      setConnectionStatus('disconnected');
    }

    return () => {
      isClosingRef.current = true;
      clearConnectionTimers();
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    
    addMessage({ 
      role: 'user', 
      content: userMessage, 
      timestamp: new Date() 
    });
    
    setLoading(true);

    const payload = JSON.stringify({ text: userMessage });

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('📤 Sending:', userMessage);
      socketRef.current.send(payload);
    } else {
      console.log('⏳ Queueing message');
      messageQueueRef.current.push(payload);
      
      addMessage({
        role: 'assistant',
        content: "Connecting to server... Please wait.",
        timestamp: new Date()
      });
      
      if (connectionStatus === 'disconnected') {
        connectWebSocket();
      }
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="pointer-events-auto mb-4 w-[90vw] sm:w-[400px] h-[600px] flex flex-col bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold">Rishab AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                      connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
                      'bg-red-500'
                    }`} />
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                      {connectionStatus === 'connecting' ? 'waking up...' : connectionStatus}
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

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="w-12 h-12 text-indigo-500 mb-3" />
                  <p className="text-zinc-400 text-sm">Ask me about Rishab's experience</p>
                  <p className="text-zinc-600 text-xs mt-1">or schedule a meeting!</p>
                </div>
              )}
              
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                      : 'bg-zinc-800/50 text-zinc-100 border border-zinc-700/50'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    
                    {/* Meeting button if action is present */}
                    {msg.action === 'suggest_meeting' && (
                      <button
                        onClick={() => {
                          // Here you would trigger your meeting booking flow
                          // For now, just show an alert
                          alert('Meeting booking feature coming soon!\n\nFor now, please email: crishab07@gmail.com');
                        }}
                        className="mt-3 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Schedule Meeting
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Assistant is thinking...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={connectionStatus === 'connected' ? "Ask me anything..." : "Connecting..."}
                  disabled={connectionStatus !== 'connected'}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading || connectionStatus !== 'connected'}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {connectionStatus === 'disconnected' && (
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
            <motion.div 
              key="close" 
              initial={{ rotate: -90, opacity: 0 }} 
              animate={{ rotate: 0, opacity: 1 }} 
              exit={{ rotate: 90, opacity: 0 }} 
              className="relative z-10"
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div 
              key="open" 
              initial={{ rotate: 90, opacity: 0 }} 
              animate={{ rotate: 0, opacity: 1 }} 
              exit={{ rotate: -90, opacity: 0 }} 
              className="relative z-10"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}