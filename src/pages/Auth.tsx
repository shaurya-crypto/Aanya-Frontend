import { useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { Mail, Eye, EyeOff, Loader2, Sun, Moon, CheckCircle, Sparkles, AlertCircle, Shield } from "lucide-react";
import Layout from "../components/Layout";

// --- VISUAL COMPONENTS (Matches Dashboard) ---

const RadiantBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-black hidden dark:block" />
      <div className="absolute inset-0 bg-radiant-mesh radiant-dark hidden dark:block mix-blend-screen opacity-50" />
      <div className="absolute inset-0 bg-radiant-mesh radiant-light dark:hidden opacity-30" />
      <div className="absolute inset-0 noise-overlay opacity-5" />
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px] animate-float-slow hidden dark:block mix-blend-screen" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[150px] animate-float-slow hidden dark:block mix-blend-screen" style={{ animationDelay: "2s" }} />
    </div>
  );
};

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

const SplashScreen = () => (
  <motion.div
    key="splash-screen"
    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020205]"
    initial={{ opacity: 1 }}
    exit={{
      opacity: 0,
      transition: { duration: 0.5, delay: 0.3 } // Wait for zoom to finish before removing bg
    }}
  >
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full opacity-50" />
    </div>

    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: [1, 1.05, 1],
        opacity: 1,
      }}
      exit={{
        scale: 100, // Zoom huge
        opacity: 0,
        transition: {
          scale: { duration: 0.8, ease: "easeIn" }, // Zoom smooth then fast
          opacity: { duration: 0.2, delay: 0.6 } // Fade out at the very end
        }
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      // ✅ FORCE GPU ACCELERATION
      style={{ willChange: "transform", transform: "translateZ(0)" }}
      className="relative z-10 flex items-center justify-center"
    >
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-primary/40 blur-2xl rounded-full"
      />
      <img
        src="/load.png"
        alt="Loading..."
        className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10 drop-shadow-2xl"
      />
    </motion.div>
  </motion.div>
);

// Google Icon Component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path
      d="M12.0003 20.45c4.6669 0 8.5829-3.4076 9.4583-7.95H12.0003v-4.5h13.25c.1436.75.2503 1.5.2503 2.25 0 7.4583-5.2917 12.45-12.45 12.45-6.9167 0-12.5-5.5833-12.5-12.5s5.5833-12.5 12.5-12.5c3.375 0 6.4167 1.25 8.7917 3.5l-3.5417 3.5417c-1.25-1.25-3.125-2.0417-5.25-2.0417-4.3333 0-7.9583 3.5417-7.9583 7.9583s3.625 7.9583 7.9583 7.9583z"
      fill="currentColor"
    />
  </svg>
);

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [show2FAInput, setShow2FAInput] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [twoFactorPin, setTwoFactorPin] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // --- THEME STATE WITH PERSISTENCE ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  // --- THEME TOGGLE EFFECT ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // --- 1. ROUTE GUARD & GOOGLE AUTH CATCHER ---
  useEffect(() => {
    // Check if Google redirected back with a token in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      // Save Google token and redirect to dashboard
      localStorage.setItem("token", urlToken);
      window.history.replaceState({}, document.title, "/auth"); // Cleans the URL
      window.location.href = "/dashboard";
      return;
    }

    // Normal check for existing login
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/dashboard";
    } else {
      setCheckingAuth(false);
    }
  }, []);

  // --- GOOGLE LOGIN HANDLER ---
  const handleGoogleLogin = () => {
    // Redirects to your backend route to start the Google OAuth flow
    window.location.href = "https://aanya-backend.onrender.com/auth/google";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 2000); // Adjust time as needed (e.g., 2000ms = 2 seconds)

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // const API_URL = "https://aanya-backend.onrender.com";
    const API_URL = "https://aanya-backend.onrender.com";
    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      console.log(`Sending request to: ${API_URL}${endpoint}`);

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          ...(!isLogin && { name: formData.name }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // 🚀 NEW: Check if the server is demanding a 2FA code
      if (data.require2FA) {
        setLoginEmail(data.email);
        setShow2FAInput(true); // Switches the UI to the PIN input screen
        return; // Stop the function here so they don't log in yet!
      }

      // Standard Login / Registration (No 2FA required)
      if (data.token) {
        localStorage.setItem("token", data.token);
        if (localStorage.getItem("token")) {
          window.location.href = isLogin ? "/dashboard" : "/onboarding";
        } else {
          throw new Error("Failed to save session.");
        }
      }

    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit2FA = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // const API_URL = "http://localhost:5000";
    const API_URL = "https://aanya-backend.onrender.com"

    try {
      const response = await fetch(`${API_URL}/auth/verify-login-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, token: twoFactorPin })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid PIN");
      }

      // 🚀 SUCCESS! They passed 2FA, log them in!
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";

    } catch (err: any) {
      console.error("2FA Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) return null;

  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-4rem)] flex w-full overflow-hidden bg-transparent text-gray-900 dark:text-foreground font-sans selection:bg-primary/30 transition-colors duration-300">

        <AnimatePresence>
          {pageLoading && <SplashScreen />}
        </AnimatePresence>

        <RadiantBackground />
        <MagneticCursor />

        {/* --- THEME TOGGLE (Absolute Top Right inside Layout) --- */}

        <div className="flex w-full h-full container mx-auto">

          {/* --- LEFT SIDE: BRANDING (Glassmorphism) --- */}
          <div className="hidden lg:flex flex-1 relative items-center justify-center p-12">
            {/* Glass Card for branding */}
            <div className="relative z-10 w-full max-w-lg rounded-[3rem] border border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl p-12 shadow-2xl overflow-hidden">

              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent opacity-50" />

              <div className="relative z-10">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
                  <span className="text-white font-display font-bold text-4xl">A</span>
                </div>

                <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Welcome to <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Aanya AI</span>
                </h2>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Your intelligent voice assistant. Sign in to manage your API keys, monitor usage, and control your PC with next-gen AI.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-400">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><CheckCircle size={18} /></div>
                    <span>Real-time Voice Processing</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-400">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Sparkles size={18} /></div>
                    <span>Advanced Analytics Dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: FORM --- */}
          <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md"
            >
              {/* Form Container (Glass) */}
              <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 md:p-10 shadow-2xl backdrop-blur-xl">

                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLogin ? "login" : "signup"}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >

                    {show2FAInput ? (
                      /* --- 🔐 2FA PIN SCREEN --- */
                      <div className="text-center animate-in fade-in zoom-in duration-300">
                        <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Shield size={32} className="text-primary" />
                        </div>
                        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          Two-Factor Auth
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-muted-foreground mb-8">
                          Enter the 6-digit PIN from your authenticator app to continue.
                        </p>

                        {error && (
                          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                          </div>
                        )}

                        <form onSubmit={handleSubmit2FA} className="space-y-6">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={twoFactorPin}
                            onChange={e => setTwoFactorPin(e.target.value.replace(/\D/g, ''))}
                            className="w-full h-14 text-center text-3xl tracking-[1em] font-mono font-bold bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                          />
                          <button
                            type="submit"
                            disabled={loading || twoFactorPin.length !== 6}
                            className="w-full h-12 rounded-xl bg-primary text-black font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify & Login"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShow2FAInput(false);
                              setError("");
                              setTwoFactorPin("");
                            }}
                            className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            Cancel and go back
                          </button>
                        </form>
                      </div>
                    ) : (
                      /* --- 👤 STANDARD LOGIN / SIGNUP SCREEN --- */
                      <>
                        <div className="text-center mb-8">
                          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {isLogin ? "Welcome Back" : "Create Account"}
                          </h1>
                          <p className="text-sm text-gray-500 dark:text-muted-foreground">
                            {isLogin ? "Enter your credentials to access your account" : "Get started with Aanya AI for free today"}
                          </p>
                        </div>

                        {error && (
                          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                          </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                          {/* ... KEEP YOUR EXISTING FORM INPUTS HERE (Name, Email, Password, Sign in Button) ... */}
                          {!isLogin && (
                            <div>
                              <label className="text-xs font-bold uppercase text-gray-500 dark:text-muted-foreground mb-2 ml-1 block">Name</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  placeholder="Your Name"
                                  className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/40 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="text-xs font-bold uppercase text-gray-500 dark:text-muted-foreground mb-2 ml-1 block">Email</label>
                            <div className="relative">
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                placeholder="name@example.com"
                                className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/40 px-4 pl-11 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                              />
                              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold uppercase text-gray-500 dark:text-muted-foreground mb-2 ml-1 block">Password</label>
                            <div className="relative">
                              <input
                                type={showPass ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                placeholder="••••••••"
                                className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/40 px-4 pl-4 pr-11 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                              >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>

                          {!isLogin && (
                            <div className="flex items-start gap-3 mt-4">
                              <div className="flex items-center h-5 mt-0.5">
                                <input
                                  id="terms"
                                  type="checkbox"
                                  required
                                  checked={agreeTerms}
                                  onChange={(e) => setAgreeTerms(e.target.checked)}
                                  className="w-4 h-4 rounded border-gray-300 dark:border-white/20 bg-white/50 dark:bg-black/40 text-primary focus:ring-primary/50 focus:ring-offset-0 transition-all cursor-pointer accent-primary"
                                />
                              </div>
                              <label htmlFor="terms" className="text-xs text-gray-500 dark:text-muted-foreground leading-tight">
                                By continuing, you agree to our{" "}
                                <a href="/terms-conditions" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold transition-all">
                                  Terms & Conditions
                                </a>
                                {" "}and{" "}
                                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold transition-all">
                                  Privacy Policy
                                </a>.
                              </label>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 mt-2 rounded-xl bg-primary text-black font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center shadow-lg hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Sign In" : "Create Account")}
                          </button>
                        </form>

                        {/* --- DIVIDER --- */}
                        <div className="relative my-8">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200 dark:border-white/10" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white/0 dark:bg-black/0 px-2 text-gray-500 backdrop-blur-xl">Or continue with</span>
                          </div>
                        </div>
                        <a
                          href="https://aanya-backend.onrender.com/auth/google"
                          className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-gray-700 dark:text-white text-sm font-bold transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                          <GoogleIcon />
                          Google
                        </a>

                        <p className="text-sm text-center mt-8 text-gray-500 dark:text-muted-foreground">
                          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                          <button
                            onClick={() => { setIsLogin(!isLogin); setError(""); }}
                            className="text-primary font-bold hover:underline focus:outline-none transition-all ml-1"
                          >
                            {isLogin ? "Sign up" : "Sign in"}
                          </button>
                        </p>
                      </>
                    )}

                  </motion.div>
                </AnimatePresence>

              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
