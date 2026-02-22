import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, useMotionValue } from "framer-motion";
import { Check, Sparkles, Zap, Crown, Code, User, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ScrollReveal from "../components/ScrollReveal";

// --- Background Components (Matches Index.tsx) ---

const RadiantBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Dark Mode Gradient */}
      <div className="absolute inset-0 bg-black hidden dark:block" />
      <div className="absolute inset-0 bg-radiant-mesh radiant-dark hidden dark:block mix-blend-screen" />
      {/* Light Mode Gradient */}
      <div className="absolute inset-0 bg-radiant-mesh radiant-light dark:hidden" />
      {/* Noise */}
      <div className="absolute inset-0 noise-overlay" />
      {/* Floating Orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-float-slow hidden dark:block mix-blend-screen" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/20 blur-[120px] animate-float-slow hidden dark:block mix-blend-screen" style={{ animationDelay: "2s" }} />
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
      <div className="w-full h-full rounded-full bg-white/40 dark:bg-primary/30 blur-[60px]" />
    </motion.div>
  );
};

// --- Data ---

const plans = [
  {
    name: "Free",
    icon: Zap,
    monthly: 0,
    yearly: 0,
    desc: "Perfect for getting started.",
    features: ["40 requests/day", "System Control (Volume, Brightness)", "Standard Response Speed", "Community Support"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    icon: Crown,
    monthly: 9,
    yearly: 90,
    desc: "Unlock the full AI personality.",
    features: ["100 requests/day", "Unlocks 'Sweet' & 'Sassy' Modes", "Context Awareness", "Priority Support"],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Custom",
    icon: User,
    monthly: 29,
    yearly: 290,
    desc: "Train Aanya on your data.",
    features: ["300 requests/day", "Train on your own PDFs/Docs", "Custom Wake Word", "Early Access Features"],
    cta: "Go Custom",
    popular: false,
  },
  {
    name: "Developer",
    icon: Code,
    monthly: 99,
    yearly: 99,
    desc: "Full code ownership.",
    features: ["Full Source Code Access", "Self-hosting Documentation", "Commercial License", "Direct Dev Support"],
    cta: "Buy License",
    popular: false,
    oneTime: true,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <Layout>
      <RadiantBackground />
      <MagneticCursor />

      <section className="relative min-h-screen pt-24 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          
          {/* Header */}
          <ScrollReveal className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-5xl md:text-7xl font-bold mb-6"
            >
              Simple, <span className="text-gradient-hero">Transparent</span> Pricing
            </motion.h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Choose the plan that fits your workflow. Upgrade or downgrade anytime.
            </p>

            {/* Glass Toggle */}
            <div className="inline-flex items-center p-1.5 rounded-2xl glass-button">
              <button
                onClick={() => setYearly(false)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  !yearly ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  yearly ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${yearly ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                  -17%
                </span>
              </button>
            </div>
          </ScrollReveal>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, i) => (
              <ScrollReveal key={plan.name} delay={i * 0.1} className="h-full">
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`relative glass-panel p-8 rounded-[2rem] flex flex-col h-full transition-all duration-300 ${
                    plan.popular ? "border-primary/50 shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)]" : ""
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-lg uppercase tracking-wide">
                      <Sparkles size={12} />
                      Best Value
                    </div>
                  )}

                  {/* Icon & Title */}
                  <div className="mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                      plan.popular ? "bg-primary text-white" : "bg-secondary text-foreground"
                    }`}>
                      <plan.icon size={24} />
                    </div>
                    <h3 className="font-display font-bold text-2xl text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{plan.desc}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl font-bold text-foreground">
                        ${plan.oneTime ? plan.monthly : yearly ? plan.yearly : plan.monthly}
                      </span>
                      <span className="text-muted-foreground font-medium">
                        {plan.oneTime ? "" : yearly ? "/year" : "/mo"}
                      </span>
                    </div>
                    {plan.oneTime && <span className="text-xs text-primary font-medium uppercase tracking-wider">One-time payment</span>}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-foreground/80">
                        <div className="mt-0.5 min-w-[18px] h-[18px] rounded-full bg-primary/20 flex items-center justify-center">
                          <Check size={10} className="text-primary" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    to="/auth"
                    className={`h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                      plan.popular
                        ? "btn-primary" // Uses the neon glow button defined in index.css
                        : "glass-button text-foreground hover:bg-foreground hover:text-background"
                    }`}
                  >
                    {plan.cta}
                    {plan.popular && <ChevronRight size={16} />}
                  </Link>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* FAQ or Extra Info (Optional visual filler) */}
          <div className="mt-24 text-center">
             <p className="text-muted-foreground text-sm">
               Need a custom enterprise solution? <a href="#" className="text-primary hover:underline">Contact Sales</a>
             </p>
          </div>

        </div>
      </section>
    </Layout>
  );
}