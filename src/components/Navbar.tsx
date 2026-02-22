import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, MonitorSmartphone, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
];

var logged = false;
var msg = "";
var auth_msg = "";

if (localStorage.getItem("token") !== null) {
  logged = true;
  msg = "Go to Dashboard"
  auth_msg = "/dashboard"
} else {
  logged = false;
  msg = "Get Started"
  auth_msg = "/auth"
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
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

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          
          {/* --- ✨ NEW GLASSY CONTROL PC BUTTON ✨ --- */}
          {logged && (
            <Link to="/control-pc" className="hidden md:block relative group">
              {/* Animated watery background blur */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500"
              />
              
              {/* Actual Button */}
              <button className="relative flex items-center gap-2 h-9 px-4 rounded-xl bg-white/20 dark:bg-black/40 border border-white/40 dark:border-white/10 backdrop-blur-md text-sm font-bold text-gray-900 dark:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_15px_rgba(0,229,255,0.4)] transition-all duration-300">
                <MonitorSmartphone size={16} className="text-cyan-600 dark:text-cyan-400" />
                Control PC
                <Sparkles size={12} className="absolute top-1 right-1 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to={auth_msg}
            className="hidden md:inline-flex h-9 px-5 rounded-xl bg-primary text-black text-sm font-bold items-center justify-center hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            {msg}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden h-9 w-9 flex items-center justify-center text-muted-foreground"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass border-t border-border/50"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Control PC Button */}
              {logged && (
                <Link
                  to="/control-pc"
                  onClick={() => setMobileOpen(false)}
                  className="h-10 px-4 mt-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <MonitorSmartphone size={18} />
                  Control PC
                </Link>
              )}

              <Link
                to={auth_msg}
                onClick={() => setMobileOpen(false)}
                className="h-10 px-4 mt-2 rounded-xl bg-primary text-black text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/20"
              >
                {msg}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}