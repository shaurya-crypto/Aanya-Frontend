import { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { ArrowLeft, Construction, Rocket, Sparkles, Sun, Moon, Hammer } from "lucide-react";
import { Link } from "react-router-dom";

// --- REUSED VISUAL COMPONENTS (Matches Dashboard) ---

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

export default function ComingSoon() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme Toggle Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-transparent text-gray-900 dark:text-foreground font-sans selection:bg-primary/30 transition-colors duration-300">
      <RadiantBackground />
      <MagneticCursor />

      {/* --- TOP BAR --- */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6 md:p-10 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <a href="/">
            {/* <div className="h-10 w-10 min-w-[40px] rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg"></div> */}
            <img
              src="/logo.png"
              alt="Aanya AI"
              className="h-10 w-10 min-w-[40px] rounded-xl object-cover shadow-lg bg-white dark:bg-black"
            />
          </a>
          <span className="font-display font-bold text-lg text-foreground">Aanya AI</span>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="h-10 w-10 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-all shadow-sm backdrop-blur-md"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          {/* Glass Card */}
          <div className="rounded-[2.5rem] border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-10 md:p-14 text-center shadow-2xl backdrop-blur-2xl relative overflow-hidden group">

            {/* Background Glow inside card */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-[60px] pointer-events-none group-hover:bg-primary/30 transition-all duration-700" />

            {/* Icon Animation */}
            <div className="relative mb-8 flex justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="h-24 w-24 rounded-3xl bg-gradient-to-br from-gray-100 to-white dark:from-white/10 dark:to-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-xl"
              >
                <Rocket size={48} className="text-primary" />
              </motion.div>
              {/* Floating particles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Sparkles size={16} className="absolute -top-4 -right-4 text-accent animate-pulse" />
                <Construction size={16} className="absolute -bottom-2 -left-6 text-gray-400 dark:text-gray-500" />
              </motion.div>
            </div>

            {/* Text Content */}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Work in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Progress</span>
            </h1>

            <p className="text-gray-500 dark:text-muted-foreground text-lg mb-10 leading-relaxed">
              We're currently crafting this experience. <br className="hidden md:block" />
              Check back soon for something amazing!
            </p>

            {/* Fake Progress Bar */}
            <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden mb-10">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "75%" }}
                transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
              />
            </div>

            {/* Back Button */}
            <div className="flex justify-center">
              <Link
                to="/dashboard"
                className="h-12 px-8 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </Link>
            </div>

          </div>
        </motion.div>
      </main>

      {/* Footer Text */}
      <footer className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-xs font-medium text-gray-400 dark:text-white/20 uppercase tracking-widest">
          Developing &bull; Aanya AI
        </p>
      </footer>

    </div>
  );
}