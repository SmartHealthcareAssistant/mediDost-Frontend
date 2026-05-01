
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  User, 
  Bot, 
  AlertCircle, 
  Mic, 
  Trash2,
  RefreshCw 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste I'm MediDost AI. I am here to help you identify symptoms and find the right specialist.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false); // State for voice input
  const [sessionId, setSessionId] = useState("");
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef(null);

  // Quick action suggestions
  const suggestions = [
    "Analyze Symptoms",
    "Diet Advice",
    "Emergency Help"
  ];

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Helper function to get a new session ID
  const fetchNewSession = async () => {
    try {
      const response = await axios.get("https://smart-healthcare-app-ghwj.onrender.com/api/session");
      setSessionId(response.data.sessionId);
    } catch (error) {
      // Use console.warn instead of error to avoid alarming logs
      console.warn("Backend unreachable. Switching to offline demo mode.");
      // Fallback if server is unreachable
      setSessionId("demo-session-" + Math.random().toString(36).substr(2, 9));
    }
  };

  // Fetch session ID on component mount
  useEffect(() => {
    fetchNewSession();
  }, []);

  // Voice Input Handler
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US'; // You can change this to 'hi-IN' for Hindi support
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  const handleClearChat = () => {
    // 1. Reset UI messages
    setMessages([
      {
        sender: "bot",
        text: "Chat cleared. How can I help you now?",
      },
    ]);
    
    // 2. Fetch a NEW session ID so the backend forgets previous context
    fetchNewSession();
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMessage = { sender: "user", text: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Send to Backend
      const response = await axios.post("https://smart-healthcare-app-ghwj.onrender.com/api/chat", {
        message: text,
        sessionId,
      });

    // 3. Add Bot Response
    const { reply, specialist, severity } = response.data;
        
    // Add main formatted reply
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: reply }
    ]);
    
    // 🔴 Show emergency alert if severity is high
    if (severity === "high") {
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "🚨 This may require urgent medical attention. Please seek emergency care immediately."
        }
      ]);
    }
    } catch (err) {
      console.warn("Backend offline, generating demo response.");
      
      // FALLBACK / DEMO MODE RESPONSES
      // This allows the UI to work even without the backend running
      setTimeout(() => {
        let demoReply = "I am currently in Offline Mode (Backend unavailable). I can't connect to the live AI, but I can simulate how I would work.";
        
        const lowerInput = text.toLowerCase();
        
        if (lowerInput.includes("fever") || lowerInput.includes("temperature") || lowerInput.includes("flu")) {
          demoReply = "It sounds like you might have an infection. Please monitor your temperature. If it exceeds 102°F or lasts more than 3 days, consult a General Physician. Stay hydrated!";
        } else if (lowerInput.includes("dermatologist") || lowerInput.includes("skin") || lowerInput.includes("rash")) {
          demoReply = "I can help you find a skin specialist. Based on your location, Dr. Sharma and Dr. Verma are highly rated Dermatologists nearby. Would you like to book an appointment?";
        } else if (lowerInput.includes("appointment") || lowerInput.includes("book")) {
          demoReply = "I can schedule that for you. Please select a preferred date and time for your visit.";
        } else if (lowerInput.includes("mental") || lowerInput.includes("sad") || lowerInput.includes("anxiety")) {
          demoReply = "I'm sorry you're feeling this way. Speaking to a mental health professional can really help. Would you like to see a list of available counselors?";
        } else if (lowerInput.includes("diet") || lowerInput.includes("food")) {
          demoReply = "For a balanced diet, focus on whole grains, lean proteins, and plenty of vegetables. Avoid processed sugars. Would you like a specific meal plan for a condition?";
        }

        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: demoReply },
        ]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center space-x-2 text-white">
<div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
  <Bot size={18} className="text-green-400" />
</div>
                <div>
                  <h3 className="font-bold text-sm">MediDost Assistant</h3>
                  <p className="text-xs text-blue-100 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                 {/* Clear Chat Button */}
                <button 
                  onClick={handleClearChat}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                  title="Clear Chat"
                >
                  <RefreshCw size={18} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
              {/* Date separator example */}
              <div className="text-center text-xs text-gray-400 my-2">Today</div>

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-end max-w-[80%] space-x-2 ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
                    
                    {/* Avatar */}
<div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
  msg.sender === "user" ? "bg-blue-600 text-white" : "bg-blue-500"
}`}>
  {msg.sender === "user" ? (
    <User size={14} />
  ) : (
    <Bot size={14} className="text-green-400" />
  )}
</div>

                    {/* Bubble */}
                    <div
                      className={`p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-end space-x-2">
<div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
  <Bot size={14} className="text-green-400" />
</div>
                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Chips (Only show if not loading) */}
            {!isLoading && messages.length < 5 && (
              <div className="px-4 pb-2 bg-slate-50 overflow-x-auto flex gap-2 no-scrollbar">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className="whitespace-nowrap bg-white border border-blue-100 text-blue-600 text-xs px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                
                {/* Voice Input Button */}
                <button
                  onClick={startListening}
                  className={`mr-2 p-1.5 rounded-full transition-all ${
                    isListening 
                      ? "bg-red-500 text-white animate-pulse" 
                      : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  title="Speak"
                >
                  <Mic size={18} />
                </button>

                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
                  placeholder={isListening ? "Listening..." : "Type your symptoms..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className={`ml-2 p-2 rounded-full transition-all ${
                    input.trim() 
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
              <div className="text-center mt-2">
                <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                  <AlertCircle size={10} />
                  AI info may be inaccurate. Not for emergencies.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

{/* Floating Toggle Button */}
<div className="relative flex flex-col items-end">

  {/* Tooltip */}
  {!isOpen && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-3 mr-2 bg-white text-blue-700 text-xs px-4 py-2 rounded-full shadow-lg"
    >
      Need medical help?
    </motion.div>
  )}

  <motion.button
    onClick={() => setIsOpen(!isOpen)}
    whileTap={{ scale: 0.9 }}
    className="relative w-16 h-16 rounded-full flex items-center justify-center
               bg-gradient-to-br from-blue-600 to-blue-500
               shadow-2xl shadow-blue-300/40
               transition-all duration-300"
  >
    {/* Breathing Glow ONLY when closed */}
    {!isOpen && (
      <span className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping"></span>
    )}

    {/* Glass Layer */}
    <span className="absolute inset-1 rounded-full bg-white/10 backdrop-blur-sm"></span>

    {/* Smooth Icon Transition */}
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key="close"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative"
        >
          <X size={26} className="text-white" />
        </motion.div>
      ) : (
        <motion.div
          key="bot"
          initial={{ rotate: 90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: -90, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative"
        >
          <Bot
            size={28}
            className="text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
          />
        </motion.div>
      )}
    </AnimatePresence>

    {/* Online Indicator (only when closed) */}
    {!isOpen && (
      <span className="absolute bottom-2 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
    )}
  </motion.button>
</div>
    </div>
  );
}
