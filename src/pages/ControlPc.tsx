import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Monitor, Smartphone, Key,
  Wifi, Loader2, Server, ShieldCheck, LogOut, AlertTriangle, Mic, MicOff, AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { io, Socket } from "socket.io-client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// --- TYPES ---
interface Message {
  id: string;
  text: string;
  sender: "user" | "pc" | "system" | "error";
  timestamp: Date;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ControlPC() {
  // --- STATE ---
  const [isLinked, setIsLinked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { id: "sys-1", text: "Secure End-to-End connection established.", sender: "system", timestamp: new Date() },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const recognitionRef = useRef<any>(null);
  const apiKeyRef = useRef(apiKey);

  // const API_URL = "http://localhost:5000"; // Change to Render URL in production
  const API_URL = "https://aanya-backend.onrender.com"

  // Keep API Key Ref updated for the Voice callback
  useEffect(() => {
    apiKeyRef.current = apiKey;
  }, [apiKey]);

  // --- AUTH & AUTO-CONNECT CHECK ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    // Check for saved key (7-day validity)
    const savedData = localStorage.getItem("aanya_remote_key");
    if (savedData) {
      const { key, expiry } = JSON.parse(savedData);
      if (Date.now() < expiry) {
        setApiKey(key);
        autoConnect(key, token);
      } else {
        localStorage.removeItem("aanya_remote_key");
      }
    }
  }, []);

  // --- AUTO SCROLL CHAT (FIXED) ---
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      // Scrolls only the chat container, preventing the whole page from jumping to footer
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- CLEANUP ---
  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // --- INIT SPEECH RECOGNITION (AUTO-SEND) ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        // Instantly send voice text to PC
        sendCommandToPC(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // --- CORE FUNCTIONS ---
  const sendCommandToPC = (cmd: string) => {
    if (!cmd.trim() || !socketRef.current) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: cmd, sender: "user", timestamp: new Date() }]);
    socketRef.current.emit("send_command", { apiKey: apiKeyRef.current, command: cmd });
  };

  const setupSocketListeners = (socket: Socket, currentKey: string) => {
    socket.on("connect", () => {
      socket.emit("join_room", { apiKey: currentKey, role: "phone" });
      setIsLinked(true);
    });

    socket.on("system_message", (msg) => {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: msg, sender: "system", timestamp: new Date() }]);
    });

    // UPDATE THIS BLOCK
    socket.on("receive_response", (data: any) => {
      // Safely extract the reply string from the data object
      const reply = typeof data === "string" ? data : data.reply;

      const lowerReply = reply.toLowerCase();
      const isError = lowerReply.includes("error") || lowerReply.includes("limit") || lowerReply.includes("timeout") || lowerReply.includes("failed");

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: reply,
        sender: isError ? "error" : "pc",
        timestamp: new Date()
      }]);
    });
  };

  const autoConnect = async (key: string, token: string) => {
    setIsVerifying(true);
    try {
      const res = await fetch(`${API_URL}/user/verify-pc-link`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key })
      });
      if (!res.ok) throw new Error();

      const socket = io(API_URL);
      socketRef.current = socket;
      setupSocketListeners(socket, key);
    } catch {
      localStorage.removeItem("aanya_remote_key"); // Clear invalid key
      setApiKey("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!apiKey.trim()) return setError("API Key is required.");

    setIsVerifying(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/user/verify-pc-link`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      // Save for 7 days (7 * 24 * 60 * 60 * 1000)
      localStorage.setItem("aanya_remote_key", JSON.stringify({
        key: apiKey.trim(),
        expiry: Date.now() + 604800000
      }));

      const socket = io(API_URL);
      socketRef.current = socket;
      setupSocketListeners(socket, apiKey.trim());

    } catch (err: any) {
      setError(err.message || "Could not connect to PC.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    sendCommandToPC(inputText);
    setInputText("");
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleUnlink = () => {
    if (window.confirm("Disconnect from your PC? This will clear your saved session.")) {
      if (socketRef.current) socketRef.current.disconnect();
      localStorage.removeItem("aanya_remote_key");
      setIsLinked(false);
      setApiKey("");
      setMessages([{ id: "sys-1", text: "Secure End-to-End connection established.", sender: "system", timestamp: new Date() }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020205] text-gray-900 dark:text-foreground font-sans selection:bg-primary/30 flex flex-col relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-start pt-28 md:pt-36 pb-12 px-4 md:px-8 relative z-10 w-full max-w-5xl mx-auto min-h-[85vh]">

        <AnimatePresence mode="wait">
          {!isLinked ? (
            /* =========================================
               STATE 1: VERIFICATION SCREEN 
               ========================================= */
            <motion.div
              key="link-screen"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-md mt-10"
            >
              <div className="rounded-[2.5rem] border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-2xl shadow-2xl p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />

                <div className="text-center mb-8">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 mb-4 shadow-inner">
                    <Monitor size={32} className="text-gray-400 absolute -ml-6 -mt-2" />
                    <Smartphone size={24} className="text-primary absolute ml-6 mt-4 drop-shadow-lg" />
                    <Wifi size={16} className="text-accent absolute -mt-8 animate-pulse" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Link Your PC</h2>
                  <p className="text-sm text-gray-500 dark:text-muted-foreground mt-2 leading-relaxed">
                    Enter the API key currently active in your Aanya Desktop App to establish a secure remote connection.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle size={16} shrink-0 />
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerify} className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 dark:text-muted-foreground mb-2 ml-1 block">Active API Key</label>
                    <div className="relative">
                      <input
                        type="text" required
                        value={apiKey} onChange={e => setApiKey(e.target.value)}
                        placeholder="aanya_..."
                        className="w-full h-14 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-5 pl-12 text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                      />
                      <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || !apiKey}
                    className="w-full h-14 rounded-2xl bg-primary text-black font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/20"
                  >
                    {isVerifying ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                    {isVerifying ? "Verifying & Connecting..." : "Connect to PC"}
                  </button>
                </form>
              </div>
            </motion.div>

          ) : (

            /* =========================================
               STATE 2: REMOTE CONTROL CHAT INTERFACE
               ========================================= */
            <motion.div
              key="chat-screen"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-[75vh] min-h-[600px] max-h-[900px] flex flex-col rounded-[2.5rem] border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
              {/* CHAT HEADER */}
              <div className="h-20 px-6 sm:px-8 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#111]/80 flex items-center justify-between shrink-0 z-10 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 bg-gradient-to-tr from-primary to-accent rounded-full p-[2px] shadow-lg">
                      <div className="w-full h-full bg-white dark:bg-black rounded-full flex items-center justify-center overflow-hidden">
                        <Monitor size={20} className="text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#111] rounded-full shadow-sm" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">Aanya Desktop</h3>
                    <p className="text-xs text-green-600 dark:text-green-400 font-bold tracking-wide flex items-center gap-1.5 mt-0.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Connected & Listening
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleUnlink}
                  className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Disconnect</span>
                </button>
              </div>

              {/* CHAT MESSAGES AREA */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-gray-50/50 dark:bg-black/40 
                          scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-white/20"
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg) => {

                    if (msg.sender === "system") {
                      return (
                        <motion.div key={msg.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center my-6">
                          <span className="px-5 py-2 bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md shadow-sm">
                            {msg.text}
                          </span>
                        </motion.div>
                      )
                    }

                    const isUser = msg.sender === "user";
                    const isError = msg.sender === "error";

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                      >
                        <div className={`flex items-end gap-3 max-w-[85%] sm:max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>

                          {/* Avatar */}
                          <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-sm mb-1 ${isUser ? "bg-primary/20 text-primary" :
                              isError ? "bg-red-500/20 text-red-500" : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                            }`}>
                            {isUser ? <Smartphone size={14} /> : isError ? <AlertCircle size={14} /> : <Server size={14} />}
                          </div>

                          {/* Message Bubble */}
                          <div className={`p-4 sm:p-5 shadow-md ${isUser
                              ? "bg-primary text-black rounded-[1.5rem] rounded-br-sm"
                              : isError
                                ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-[1.5rem] rounded-bl-sm"
                                : "bg-white dark:bg-[#1a1a1c] text-gray-900 dark:text-white border border-gray-100 dark:border-white/5 rounded-[1.5rem] rounded-bl-sm"
                            }`}>
                            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] text-gray-400 dark:text-gray-500 mt-2 px-12 ${isUser ? "text-right" : "text-left"}`}>
                          {format(msg.timestamp, "h:mm a")}
                        </span>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {/* CHAT INPUT AREA */}
              <div className="p-4 sm:p-6 bg-white/90 dark:bg-[#0a0a0c]/90 border-t border-gray-200 dark:border-white/10 backdrop-blur-xl shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3 relative max-w-5xl mx-auto">

                  {/* Voice Input Button */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`shrink-0 h-14 w-14 rounded-full flex items-center justify-center transition-all shadow-sm ${isListening
                        ? "bg-red-500 text-white animate-pulse shadow-red-500/30"
                        : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10"
                      }`}
                  >
                    {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                  </button>

                  <div className="relative flex-1 flex items-center">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isListening ? "Listening... (Will send automatically)" : "Send a command to your PC (e.g. 'Lock my screen')..."}
                      className={`w-full h-14 pl-6 pr-14 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl text-sm md:text-base text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white dark:focus:bg-[#111] transition-all shadow-inner ${isListening ? "border-red-500/50 dark:border-red-500/50 text-red-500" : ""
                        }`}
                    />

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="absolute right-2 h-10 w-10 flex items-center justify-center bg-primary text-black rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-md"
                    >
                      <Send size={18} className="-ml-0.5 mt-0.5" />
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={12} /> End-to-End Encrypted via Aanya Socket
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
