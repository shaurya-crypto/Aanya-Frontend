

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import {
  Download as DownloadIcon,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Laptop,
  Zap,
  Lock,
  X,
  Key,
  Link
} from "lucide-react";
import Layout from "../components/Layout";
import SplashScreen from "../components/SplashScreen";

// --- VISUAL COMPONENTS (Consistency) ---

const RadiantBackground = () => (
  <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-black hidden dark:block" />
    <div className="absolute inset-0 bg-radiant-mesh radiant-dark hidden dark:block mix-blend-screen opacity-50" />
    <div className="absolute inset-0 bg-radiant-mesh radiant-light dark:hidden opacity-30" />
    <div className="absolute inset-0 noise-overlay opacity-5" />
    <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px] animate-float-slow hidden dark:block mix-blend-screen" />
    <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[150px] animate-float-slow hidden dark:block mix-blend-screen" style={{ animationDelay: "2s" }} />
  </div>
);

const MagneticCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 120, mass: 0.5 });
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 120, mass: 0.5 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 100);
      mouseY.set(e.clientY - 100);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-[200px] h-[200px] pointer-events-none z-0 hidden md:block mix-blend-overlay dark:mix-blend-screen"
      style={{ x: cursorX, y: cursorY }}
    >
      <div className="w-full h-full rounded-full bg-white/20 dark:bg-primary/20 blur-[80px]" />
    </motion.div>
  );
};

var logged = false;
var msg = "";
var auth_msg = "";

if (localStorage.getItem("token") !== null) {
  logged = true;
  msg = "Create API Key now!"
  auth_msg = "/dashboard"
} else {
  logged = false;
  msg = "Sign up and create API key!"
  auth_msg = "/auth"
}

export default function Download() {
  const [pageLoading, setPageLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn] = useState(() => localStorage.getItem("token") !== null);

  const APP_VERSION = "4.0.0";
  const DOWNLOAD_URL = "https://github.com/shaurya-crypto/Aanya-Application/releases/download/4.0.0/AanyaAI.exe";

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      setTimeout(() => setShowContent(true), 800);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    // 1. Trigger actual download
    window.location.href = DOWNLOAD_URL;
    // 2. Show thank you popup
    setShowPopup(true);
  };

  return (
    <Layout>
      <AnimatePresence>
        {pageLoading && <SplashScreen />}
      </AnimatePresence>

      <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-transparent text-gray-900 dark:text-foreground font-sans selection:bg-primary/30 transition-colors duration-300">

        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10"
          >
            <RadiantBackground />
            <MagneticCursor />

            <section className="pt-32 pb-20 px-4">
              <div className="container mx-auto">
                <div className="max-w-4xl mx-auto text-center mb-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                      <Sparkles size={14} /> Available Now
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                      Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Aanya</span> on Desktop
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      Bridge the gap between human thought and digital action. Download the client to unlock system-level voice automation.
                    </p>
                  </motion.div>
                </div>

                <div className="grid lg:grid-cols-5 gap-8 items-start max-w-6xl mx-auto">

                  {/* Left: Main Download Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3 rounded-[2.5rem] border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-10 md:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-tighter">
                      V {APP_VERSION} Stable
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                      <div className="h-32 w-32 bg-primary rounded-[2rem] flex items-center justify-center shadow-[0_0_60px_-10px_rgba(var(--primary),0.6)] rotate-3 group-hover:rotate-6 transition-transform duration-500 overflow-hidden">
                        <img
                          src="/logo.png"
                          alt="Aanya Logo"
                          className="w-60 h-60 object-contain"
                        />
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Aanya for Windows</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Itel / AMD 64-bit Architecture</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-10">
                      {[
                        { text: "Malware Scanned", color: "text-green-500" },
                        { text: "End-to-End Secure", color: "text-blue-500" },
                        { text: "Ultralight Performance", color: "text-yellow-500" },
                        { text: "Verified Publisher", color: "text-primary" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                          {/* <item className={item.color} size={18} /> */}
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.text}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleDownload}
                      className="w-full h-16 rounded-[1.5rem] bg-black dark:bg-white text-white dark:text-black font-bold text-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl active:scale-95 group"
                    >
                      <DownloadIcon size={24} className="group-hover:animate-bounce" />
                      Download .EXE
                    </button>

                    <p className="text-xs text-center text-gray-400 mt-6 font-medium">
                      Compatible with Windows 10/11 &bull; 84MB Installer
                    </p>
                  </motion.div>

                  {/* Right: Technical Requirements */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 space-y-6"
                  >
                    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/5 p-8 backdrop-blur-xl">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Laptop size={20} className="text-primary" />
                        Key Capabilities
                      </h3>
                      <ul className="space-y-5">
                        {[
                          "System Tray: Minimize and run in background.",
                          "Global Listener: Use Hotkeys to talk instantly.",
                          "Auto-Update: Stay current with new AI models.",
                          "Zero Latency: Local shell command execution."
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 rounded-3xl bg-yellow-500/5 border border-yellow-500/20 relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                        <AlertTriangle size={80} className="text-yellow-500" />
                      </div>
                      <div className="flex items-start gap-4 relative z-10">
                        <AlertTriangle className="text-yellow-500 shrink-0 mt-1" size={24} />
                        <div>
                          <h4 className="font-bold text-yellow-600 dark:text-yellow-500 text-sm mb-1">Security Notice</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            Aanya requires permission to control system inputs. Some Antivirus software might trigger a "False Positive".
                            This is standard for automation tools. Please allow the application to proceed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* --- THANK YOU MODAL (Popup) --- */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-md w-full bg-white dark:bg-[#0c0c0e] border border-gray-200 dark:border-white/10 rounded-[3rem] p-10 shadow-2xl text-center relative"
              >
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="h-20 w-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                  <CheckCircle size={40} className="text-green-500" />
                </div>

                <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4 leading-tight">Thank You for Downloading!</h3>
                <p className="text-gray-500 dark:text-muted-foreground mb-10 text-lg leading-relaxed">
                  The setup is starting. To begin using Aanya, you need an **API Key** to connect the client to your account.
                </p>

                <div className="space-y-4">
                  <a
                    href={auth_msg}
                    // to={auth_msg}
                    className="w-full h-14 rounded-2xl bg-primary text-black font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 shadow-xl shadow-primary/20 transition-all"
                  >
                    {/* <Key size={20} /> */}
                    {msg}
                  </a>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-sm font-bold text-gray-400 hover:text-primary transition-colors"
                  >
                    Close this window
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}