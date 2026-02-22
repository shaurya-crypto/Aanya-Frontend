import { useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useScroll } from "framer-motion";
import { Mic, Monitor, AlarmClock, ShieldCheck, ChevronRight, Sparkles, Play, Command } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ScrollReveal from "../components/ScrollReveal";
import {  Smartphone, Lock } from "lucide-react";

// --- Components ---

const RadiantBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-black hidden dark:block" />
      <div className="absolute inset-0 bg-radiant-mesh radiant-dark hidden dark:block mix-blend-screen" />
      <div className="absolute inset-0 bg-radiant-mesh radiant-light dark:hidden" />
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/30 blur-[120px] animate-float-slow hidden dark:block mix-blend-screen" />
      <div className="absolute bottom-[0%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/20 blur-[120px] animate-float-slow hidden dark:block mix-blend-screen" style={{ animationDelay: "2s" }} />
    </div>
  );
};

const Check_for_login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  })
}

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
      <div className="w-full h-full rounded-full bg-white/40 dark:bg-primary/30 blur-[60px]" />
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
      transition: { duration: 0.5, delay: 0.3 }
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
        scale: 100,
        opacity: 0,
        transition: {
          scale: { duration: 0.8, ease: "easeIn" },
          opacity: { duration: 0.2, delay: 0.6 }
        }
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
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


const features = [
  { icon: Mic, title: "Voice Control", desc: "Execute complex workflows with simple natural language." },
  { icon: Monitor, title: "System Automation", desc: "Control volume, brightness, and applications instantly." },
  { icon: AlarmClock, title: "Smart Scheduling", desc: "Context-aware reminders that understand your routine." },
  { icon: ShieldCheck, title: "Local Privacy", desc: "Zero-latency local processing. Your data stays yours." },
];

const commands = [
  { user: "Open Figma and play Lo-Fi", ai: "Launching Figma & Spotify Lo-Fi Playlist..." },
  { user: "Turn on Do Not Disturb", ai: "DND enabled. I'll block notifications." },
];

export default function Index() {
  const [pageLoading, setPageLoading] = useState(true);
  const [showContent, setShowContent] = useState(false); // ✅ 1. ADD CONTENT STATE
  const [isLoggedIn] = useState(() => localStorage.getItem("token") !== null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);

      setTimeout(() => {
        setShowContent(true);
      }, 200);

    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <AnimatePresence>
        {pageLoading && <SplashScreen />}
      </AnimatePresence>

      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <RadiantBackground /> {/* Heavy Component */}
          <MagneticCursor />    {/* Heavy Component */}

          {/* Hero Section */}
          <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-10">
            <div className="container mx-auto px-4 relative z-10 text-center">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mx-auto w-fit mb-8"
              >
                <div className="glass-button px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <Sparkles size={14} className="text-primary animate-pulse" />
                  <span>Now in Public Beta v3.5.0</span>
                </div>
              </motion.div>
        
              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8 drop-shadow-lg"
              >
                Your Digital <br className="hidden md:block" />
                <span className="text-gradient-hero relative inline-block">
                  Soulmate
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
              >
                Meet Aanya. The first AI desktop controller that feels alive.
                Automate your life, control your PC, and chat naturally—all through a stunning glass interface.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link
                  to={isLoggedIn ? "/dashboard" : "/auth"}
                  className="btn-primary h-14 px-8 rounded-2xl flex items-center gap-2"
                >
                  <span>{isLoggedIn ? "Go to Dashboard" : "Get Started Free"}</span>
                  <ChevronRight size={18} />
                </Link>

                <Link
                  to="/demo"
                  className="glass-button h-14 px-8 rounded-2xl font-medium flex items-center gap-2 text-foreground"
                >
                  <Play size={16} fill="currentColor" />
                  Watch Demo
                </Link>
              </motion.div>

              {/* Floating UI Card Showcase */}
              <motion.div
                initial={{ opacity: 0, y: 60, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, delay: 0.6, type: "spring" }}
                className="mt-20 max-w-4xl mx-auto perspective-1000"
              >
                <div className="glass-panel p-2 rounded-[2.5rem] relative group hover:shadow-[0_0_50px_-10px_rgba(var(--primary),0.3)] transition-shadow duration-500">

                  <div className="bg-white/40 dark:bg-black/40 rounded-[2.3rem] overflow-hidden backdrop-blur-md border border-white/20 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center">

                    {/* Visualizer (Fake) */}
                    <div className="flex-1 w-full space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                          <Mic size={28} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-display text-foreground">Listening...</h3>
                          <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ height: [10, 24, 10] }}
                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                                className="w-1.5 bg-primary rounded-full"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chat Bubbles */}
                    <div className="flex-1 w-full space-y-4">
                      {commands.map((cmd, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + (i * 0.3) }}
                          className="space-y-2"
                        >
                          <div className="flex justify-end">
                            <span className="glass-button px-4 py-2 rounded-2xl rounded-tr-sm text-sm font-medium">
                              {cmd.user}
                            </span>
                          </div>
                          <div className="flex justify-start">
                            <span className="bg-primary/20 text-foreground border border-primary/20 px-4 py-2 rounded-2xl rounded-tl-sm text-sm font-medium">
                              {cmd.ai}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-32 relative">
            <div className="container mx-auto px-4">
              <ScrollReveal className="text-center mb-20">
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                  Intelligence, <span className="opacity-70">Glassified.</span>
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                  Every feature is crafted to feel weightless and powerful.
                </p>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f, i) => (
                  <ScrollReveal key={f.title} delay={i * 0.1}>
                    <motion.div
                      whileHover={{ y: -10 }}
                      className="glass-panel p-8 rounded-3xl h-full flex flex-col justify-between group transition-all duration-300"
                    >
                      <div className="mb-6">
                        <div className="h-14 w-14 rounded-2xl glass-button flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary group-hover:text-white">
                          <f.icon size={26} />
                        </div>
                        <h3 className="font-display text-xl font-bold mb-3">{f.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {f.desc}
                        </p>
                      </div>
                      <div className="flex items-center text-sm font-medium text-primary opacity-60 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                        Learn more <ChevronRight size={14} className="ml-1" />
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Remote Control Section */}
          <section className="py-24 relative z-10 overflow-hidden">
            {/* Background ambient glow for this specific section */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
            
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                
                {/* Text Content */}
                <div className="flex-1 space-y-8">
                  <ScrollReveal>
                    <div className="glass-button w-fit px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium mb-6">
                      <Smartphone size={16} className="text-primary" />
                      <span>Remote Access</span>
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6 drop-shadow-sm">
                      Control your PC from your pocket.
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Left home in a hurry and forgot to turn off your computer? As long as Aanya is running, you're always in control. Access your system remotely via your phone, securely authenticate with your API key, and execute commands from anywhere.
                    </p>
                    
                    <div className="mt-8 space-y-4">
                      <div className="glass-panel p-4 rounded-2xl flex items-start gap-4 hover:border-primary/30 transition-colors">
                        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                          <Lock size={20} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground mb-1">Example Use Case</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            Type <span className="text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">"Lock my PC"</span> on your phone, and Aanya instantly secures your desktop back home.
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Visual Showcase (Phone to PC animation) */}
                <div className="flex-1 w-full relative perspective-1000">
                  <ScrollReveal delay={0.2}>
                    <motion.div 
                      whileHover={{ rotateY: -2, rotateX: 2 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="glass-panel p-6 md:p-10 rounded-[2.5rem] relative"
                    >
                      {/* Glowing effect inside the card */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-accent/20 blur-[80px] rounded-full pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center justify-between">
                        
                        {/* Phone Mockup */}
                        <div className="w-full sm:w-[240px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 flex flex-col gap-4 shadow-2xl relative z-20">
                          <div className="flex justify-center mb-1">
                            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                          </div>
                          
                          <div className="space-y-3 flex-1">
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-2 text-xs font-mono text-primary flex items-center gap-2">
                              <ShieldCheck size={14}/> API Connected
                            </div>
                            <div className="flex justify-end pt-2">
                              <span className="glass-button px-3 py-2 rounded-2xl rounded-tr-sm text-sm font-medium">
                                Lock my PC
                              </span>
                            </div>
                            <div className="flex justify-start">
                              <span className="bg-primary/20 border border-primary/20 px-3 py-2 rounded-2xl rounded-tl-sm text-sm font-medium text-foreground">
                                Securing desktop...
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-2 h-10 glass-button rounded-xl flex items-center px-3 opacity-60">
                            <span className="text-xs text-muted-foreground">Type a command...</span>
                          </div>
                        </div>

                        {/* Animated Connection Line */}
                        <div className="hidden sm:flex flex-1 items-center justify-center relative px-2">
                          <div className="w-full h-[2px] bg-gradient-to-r from-primary/30 to-accent/30 relative overflow-hidden rounded-full">
                            <motion.div 
                              animate={{ x: ["-100%", "300%"] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                              className="absolute top-1/2 -translate-y-1/2 left-0 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                            />
                          </div>
                        </div>

                        {/* PC Mockup Status */}
                        <div className="w-full sm:w-[220px] bg-black/60 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 shadow-[0_0_30px_rgba(var(--primary),0.15)] relative z-20">
                          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-2 relative">
                            {/* Radar pulse animation */}
                            <motion.div 
                              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 border-2 border-primary rounded-full"
                            />
                            <Lock size={28} className="text-primary" />
                          </div>
                          <h5 className="font-display font-bold text-lg">System Locked</h5>
                          <p className="text-xs text-muted-foreground">Aanya is standing by</p>
                        </div>

                      </div>
                    </motion.div>
                  </ScrollReveal>
                </div>

              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <div className="glass-panel p-12 md:p-20 rounded-[3rem] text-center max-w-5xl mx-auto overflow-hidden relative">

                {/* Glowing Orbs for CTA */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/30 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

                <ScrollReveal>
                  <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-md">
                    Ready to upgrade your workflow?
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-10 relative z-10 font-medium">
                    Join thousands of users controlling their digital world with Aanya.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                    <Link
                      to="/download"
                      className="btn-primary h-14 items-center justify-center gap-2 px-8 rounded-2xl text-lg inline-flex"
                    >
                      <Monitor size={20} />
                      Download for Windows
                    </Link>
                    <div className="flex items-center justify-center gap-2 text-sm text-foreground/60 sm:hidden">
                      <Command size={14} /> MacOS coming soon
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        </motion.div>
      )}
    </Layout>
  );
}
