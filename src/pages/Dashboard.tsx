import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import {
  Home, Key, CreditCard, Settings, Copy,
  ChevronLeft, ChevronRight, Sparkles, Loader2,
  MoreVertical, Trash2, Power, Plus, X, Activity,
  Server, Clock, AlertCircle, Download as DownloadIcon, ShieldCheck, CheckCircle,
  Menu, RefreshCw, Bell, Search, Sun, Moon,
  FileText, BookOpen, Terminal, Cpu, Code2, Zap, ArrowLeft
} from "lucide-react";
import { MonitorSmartphone } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar,
  Label
} from 'recharts';
import { format, isValid, subDays } from 'date-fns';
import ComingSoon from "./comingSoon";
import { Link, useNavigate } from "react-router-dom";
import SplashScreen from "../components/SplashScreen";
import { User, Shield, Palette, Lock } from "lucide-react";
import { ShieldAlert, Monitor, History, AlertTriangle } from "lucide-react"

const RadiantBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Dark Mode Gradient */}
      <div className="absolute inset-0 bg-black hidden dark:block" />
      <div className="absolute inset-0 bg-radiant-mesh radiant-dark hidden dark:block mix-blend-screen opacity-50" />
      {/* Light Mode Gradient */}
      <div className="absolute inset-0 bg-radiant-mesh radiant-light dark:hidden opacity-30" />
      {/* Noise */}
      <div className="absolute inset-0 noise-overlay opacity-5" />
      {/* Floating Orbs */}
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

const formatSafe = (dateInput: any, fmt = 'MMM dd') => {
  try {
    if (!dateInput) return 'N/A';
    const date = new Date(dateInput);
    if (!isValid(date)) return 'N/A';
    return format(date, fmt);
  } catch (e) {
    return 'N/A';
  }
};

// --- SIDEBAR CONFIG ---
const sidebarItems = [
  { icon: Home, label: "Overview", id: "home" },
  { icon: Activity, label: "Analytics", id: "analytics" },
  { icon: Key, label: "API Keys", id: "api" },
  { icon: DownloadIcon, label: "Download", id: "download" },
  { icon: CreditCard, label: "Billing", id: "billing" },
  // { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: BookOpen, label: "Docs", id: "docs" },
  { icon: Settings, label: "Settings", id: "settings" },
];

// --- DOCS NAVIGATION CONFIG ---
const DOCS_SECTIONS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "architecture", label: "Architecture", icon: Server },
  { id: "getting-started", label: "Getting Started", icon: Zap },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "ai-command-api", label: "AI Command API", icon: Terminal },
  { id: "pc-automation", label: "PC Automation", icon: Cpu },
  { id: "rate-limits", label: "Rate Limits", icon: Activity },
  { id: "logs-analytics", label: "Logs & Analytics", icon: Activity },
  { id: "sdk-examples", label: "SDK / Examples", icon: Code2 },
  { id: "limitations", label: "Limitations", icon: AlertTriangle },
  { id: "roadmap", label: "Roadmap", icon: Zap }
];

export default function Dashboard() {
  const navigate = useNavigate()

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };
  const [showContent, setShowContent] = useState(false);
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [setupSecret, setSetupSecret] = useState("")
  const [twoFactorPin, setTwoFactorPin] = useState("");


  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        const isDark = savedTheme === "dark";
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return isDark;
      }

      // 2. If no save, check system preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemPrefersDark) document.documentElement.classList.add('dark');
      return systemPrefersDark;
    }
    return true; // Default fallback
  });

  // Add this near your other states (e.g. below activeSettingTab)
  const [activeDocSection, setActiveDocSection] = useState("doc-overview");

  // Add this function anywhere inside the Dashboard component before the return()
  const scrollToSection = (id: string) => {
    setActiveDocSection(id);
    const element = document.getElementById(id);
    if (element) {
      // 100px offset so the sticky dashboard header doesn't cover the title
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  // --- THEME TOGGLE EFFECT ---
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove('dark');
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // UI State
  const [modalOpen, setModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [keyDesc, setKeyDesc] = useState("");
  const [generating, setGenerating] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeSettingTab, setActiveSettingTab] = useState("profile");

  // const API_URL = "http://localhost:5000";
  const API_URL = "https://aanya-backend.onrender.com"

  const fetchDashboard = async () => {
    setRefreshing(true);
    const token = localStorage.getItem("token");

    const minLoadTime = new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const [_, res] = await Promise.all([
        minLoadTime,
        fetch(`${API_URL}/user/dashboard`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ]);

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth";
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      // 🚀 NEW: Security Redirect! If they are not onboarded, kick them out.
      if (data.user && data.user.isOnboarded === false) {
        window.location.href = "/onboarding";
        return;
      }

      setUserData(data);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      // Fallback Data
      if (!userData) setUserData({ /* your fallback data */ });
    } finally {
      setLoading(false);
      setTimeout(() => setShowContent(true), 100);
      setTimeout(() => setRefreshing(false), 800);
    }
  };
  useEffect(() => {
    fetchDashboard();
  }, []);
  // --- DATA PROCESSING ---
  const { chartData, kpi, recentLogs } = useMemo(() => {
    const logs = Array.isArray(userData?.logs) ? userData.logs : [];
    const usageCurrent = userData?.usage?.current || 0;

    const totalReqs = logs.length > 0 ? logs.length : usageCurrent;
    const errors = logs.filter((l: any) => (l.status || l.statusCode) >= 400).length;
    const successRate = totalReqs > 0 ? (((totalReqs - errors) / totalReqs) * 100).toFixed(1) : "100.0";
    const totalLatency = logs.reduce((acc: number, curr: any) => acc + (curr.latency || 0), 0);
    const avgLatency = logs.length > 0 ? Math.round(totalLatency / logs.length) : 0;

    // Charts calculation
    const last7Days = [...Array(7)].map((_, i) => formatSafe(subDays(new Date(), i), 'MMM dd')).reverse();
    const chartMap = last7Days.reduce((acc: any, date: string) => {
      acc[date] = { name: date, requests: 0, errors: 0, latency: 0, count: 0 };
      return acc;
    }, {});

    logs.forEach((log: any) => {
      let rawDate = log.createdAt || log.timestamp || log.date;
      const logDate = formatSafe(rawDate, 'MMM dd');
      if (logDate !== 'N/A' && chartMap[logDate]) {
        chartMap[logDate].requests += 1;
        if ((log.status || log.statusCode) >= 400) chartMap[logDate].errors += 1;
        chartMap[logDate].latency += (log.latency || 0);
        chartMap[logDate].count += 1;
      }
    });

    // PURE DATA ONLY: Deleted the mock/random data generation block here
    let processedChart = Object.values(chartMap).map((d: any) => ({
      ...d,
      latency: d.count > 0 ? Math.round(d.latency / d.count) : 0
    }));

    return {
      chartData: processedChart,
      kpi: {
        totalReqs: totalReqs,
        errors: errors,
        successRate: successRate,
        avgLatency: avgLatency
      },
      recentLogs: logs.length > 0 ? logs.slice().reverse().slice(0, 10) : []
    };
  }, [userData]);

  const handleGenerate = async (e: any) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    setGenerating(true);

    const token = localStorage.getItem("token");

    try {
      // --- REAL API CALL RESTORED ---
      const res = await fetch(`${API_URL}/user/generate-key`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: keyName, description: keyDesc })
      });

      const data = await res.json();

      if (res.ok || data.success) {
        setModalOpen(false);
        setKeyName("");
        setKeyDesc("");
        // Refresh data immediately to show the new key
        await fetchDashboard();
      } else {
        alert("Failed to create key: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error generating key:", err);
      alert("Could not connect to the server.");
    } finally {
      setGenerating(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this API key? This will break any apps currently using it.")) return;

    try {
      const token = localStorage.getItem("token");

      // ⚠️ Note: I am assuming your route is /user/key/:id. 
      // If your backend route is just /key/:id, remove the /user part!
      const res = await fetch(`${API_URL}/user/key/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setOpenMenuId(null);
        fetchDashboard(); // Refresh the list instantly
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete key");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to connect to the server.");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      // ⚠️ Note: I am assuming your route is /user/key/:id/toggle.
      // If your backend route uses POST instead of PUT, change the method below!
      const res = await fetch(`${API_URL}/user/key/${id}/toggle`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setOpenMenuId(null);
        fetchDashboard(); // Refresh the list instantly to show Active/Inactive
      } else {
        const data = await res.json();
        alert(data.error || "Failed to toggle key status");
      }
    } catch (err) {
      console.error("Toggle Error:", err);
      alert("Failed to connect to the server.");
    }
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  // --- UI COMPONENTS ---
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-black/90 border border-gray-200 dark:border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-xl">
          <p className="text-xs font-bold text-gray-900 dark:text-white mb-1">{label}</p>
          {payload.map((p: any, index: number) => (
            <p key={index} className="text-[10px] font-medium" style={{ color: p.color }}>
              {p.name}: <span className="font-mono font-bold">{p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-gray-300 dark:hover:border-white/20"
    >
      <div className={`absolute -top-4 -right-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 ${color}`}>
        <Icon size={100} />
      </div>
      <div className="relative z-10">
        <p className="text-xs font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-foreground mb-2">{value}</h3>
        <p className="text-xs text-gray-500 dark:text-muted-foreground flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`}></span>
          {subtext}
        </p>
      </div>
    </motion.div>
  );

  const usage = userData?.user?.globalRequestCount || 0;
  const limit = userData?.user?.limit || 40;
  const percent = limit > 0 ? Math.min((usage / limit) * 100, 100) : 0;
  const planName = userData?.user?.plan || "free";

  const handleSetup2FA = async () => {
    try {
      console.log("🚀 Requesting QR Code...");
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/auth/generate-2fa`, {
        method: "POST", // 👈 THIS fixes the 404 error!
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("📥 Server Status:", res.status);

      // If the server sends back an error page instead of JSON, we catch it here
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("❌ Server didn't send JSON. It sent:", text);
        return alert(`Server Error: Status ${res.status}`);
      }

      if (res.ok) {
        setQrCodeUrl(data.qrCodeUrl);
        setSetupSecret(data.secret)
        setShow2FAModal(true);
      } else {
        alert(data.error || "Failed to generate QR Code");
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      alert("Network error: Failed to setup 2FA");
    }
  };

  const handleVerify2FA = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/verify-2fa`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: twoFactorPin })
      });
      if (res.ok) {
        alert("2FA Enabled!");
        setShow2FAModal(false);
        fetchDashboard(); // Refresh UI
      } else {
        alert("Invalid PIN. Try again.");
      }
    } catch (err) {
      alert("Verification failed.");
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/auth/revoke-session`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sessionId })
      });
      fetchDashboard(); // Refresh the list
    } catch (err) {
      alert("Failed to revoke session");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return alert("Please fill in both fields");

    setIsUpdatingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        alert(data.error || "Failed to update password");
      }
    } catch (err) {
      alert("Server error occurred.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleAccountDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure? This will PERMANENTLY delete your account, API keys, and all logs. This cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/delete-account`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        localStorage.removeItem("token");
        window.location.href = "/auth"; // Kick them out to login
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete account");
      }
    } catch (err) {
      alert("Server error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-foreground font-sans selection:bg-primary/30 transition-colors duration-300">

      <AnimatePresence>
        {loading && <SplashScreen />}
      </AnimatePresence>

      {/* ✅ STEP 3: CONTENT REVEAL WRAPPER */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen" // Added this to ensure layout works
        >
          {/* HEAVY BACKGROUND COMPONENTS LOAD ONLY NOW */}
          <RadiantBackground />
          <MagneticCursor />

          {/* --- MOBILE OVERLAY --- */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden"
              />
            )}
          </AnimatePresence>


          {/* --- SIDEBAR (HOVER TO EXPAND) --- */}
          <aside
            onMouseEnter={() => setSidebarExpanded(true)}
            onMouseLeave={() => setSidebarExpanded(false)}
            className={`
            fixed inset-y-0 left-0 z-[70] flex flex-col
            bg-white/80 dark:bg-[#050505]/60 backdrop-blur-2xl border-r border-gray-200 dark:border-white/10 shadow-2xl
            transition-all duration-300 ease-in-out
            ${mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
            ${sidebarExpanded || mobileMenuOpen ? "md:w-64" : "md:w-20"}
            overflow-visible
          `}
          >
            {/* Sidebar Header (Logo + Text) */}
            <div className="h-20 flex items-center justify-between px-0 md:justify-center relative border-b border-gray-200/50 dark:border-white/5 mx-4">
              <div className={`flex items-center gap-3 transition-all duration-300 ${!sidebarExpanded ? 'justify-center w-full' : 'w-full'}`}>
                <a href="/">
                  {/* Logo
             <div className="h-10 w-10 min-w-[40px] rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg">A</div> */}
                  <img
                    src="/logo.png"
                    alt="Aanya AI"
                    className="h-10 w-10 min-w-[40px] rounded-xl object-cover shadow-lg bg-white dark:bg-black"
                  />
                </a>
                {/* Text - Animates In/Out */}
                <a href="/">
                  <AnimatePresence>
                    {(sidebarExpanded || mobileMenuOpen) && (
                      <motion.span
                        initial={{ opacity: 0, x: -10, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: "auto" }}
                        exit={{ opacity: 0, x: -10, width: 0 }}
                        className="font-display font-bold text-xl tracking-tight text-gray-900 dark:text-white whitespace-nowrap overflow-hidden"
                      >
                        Aanya AI
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              </div>

              {/* Mobile Close Button */}
              <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-gray-500"><X size={20} /></button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-hidden hover:overflow-y-auto custom-scrollbar">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "billing") {
                      navigate("/coming-soon"); // Redirects to Coming Soon page
                    } else {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 h-12 px-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${activeTab === item.id
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                >
                  <item.icon size={22} className={`shrink-0 ${activeTab === item.id ? "text-primary" : "group-hover:text-gray-900 dark:group-hover:text-white transition-colors"}`} />

                  <AnimatePresence>
                    {(sidebarExpanded || mobileMenuOpen) && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        className="whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {(sidebarExpanded || mobileMenuOpen) && activeTab === item.id && (
                    <motion.div layoutId="active-dot" className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </nav>

            {/* Sidebar Footer */}
            {(sidebarExpanded || mobileMenuOpen) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 border-t border-gray-200/50 dark:border-white/5 bg-gray-50/50 dark:bg-black/20"
              >
                <div className="rounded-xl p-3 border border-gray-200 dark:border-white/5 bg-white/60 dark:bg-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-muted-foreground">Current Plan</span>
                    <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 uppercase">{planName}</span>
                  </div>
                  <div className="relative w-full h-1 rounded-full bg-gray-200 dark:bg-black/50 overflow-hidden mb-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                  <p className="text-[10px] text-right text-gray-500 dark:text-muted-foreground font-mono">{usage} / {limit}</p>
                </div>
              </motion.div>
            )}
          </aside>

          {/* --- MAIN CONTENT WRAPPER --- */}
          <div className="flex flex-col min-h-screen transition-all duration-300 md:ml-20">

            {/* --- CUSTOM TOPBAR --- */}
            {/* --- CUSTOM TOPBAR --- */}
            <div className="sticky top-0 z-40 h-16 px-6 md:px-10 flex items-center justify-between backdrop-blur-xl bg-white/30 dark:bg-[#020205]/30 transition-all">

              {/* Left: Mobile Trigger & Breadcrumbs */}
              <div className="flex items-center gap-4">
                <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  <Menu size={24} />
                </button>
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 font-medium">
                  <span
                    onClick={() => setActiveTab('home')}
                    className="hover:text-primary cursor-pointer transition-colors"
                  >
                    Dashboard
                  </span>
                  <span className="text-gray-300 dark:text-gray-700">/</span>
                  <span className="text-gray-900 dark:text-white capitalize">{activeTab}</span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* --- ✨ GLASSY CONTROL PC BUTTON ✨ --- */}
                <Link to="/control-pc" className="hidden md:block relative group">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500"
                  />
                  <button className="relative flex items-center gap-2 h-9 px-4 rounded-xl bg-white/20 dark:bg-black/40 border border-white/40 dark:border-white/10 backdrop-blur-md text-sm font-bold text-gray-900 dark:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_15px_rgba(0,229,255,0.4)] transition-all duration-300">
                    <MonitorSmartphone size={16} className="text-cyan-600 dark:text-cyan-400" />
                    Control PC
                    <Sparkles size={12} className="absolute top-1 right-1 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </Link>

                {/* Refresh Button */}
                <button
                  onClick={fetchDashboard}
                  disabled={refreshing}
                  className="h-9 px-3 rounded-lg bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 border border-gray-200 dark:border-white/10"
                >
                  <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                  {refreshing ? "Updating..." : "Refresh"}
                </button>

                {/* User Profile / Settings */}
                <div
                  onClick={() => setActiveTab('settings')}
                  className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md cursor-pointer hover:scale-105 transition-transform"
                >
                  {userData?.user?.name?.[0] || "U"}
                </div>
              </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
              {showContent && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="max-w-7xl mx-auto"
                >

                  {/* PAGE TITLE */}
                  <header className="mb-8">
                    <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {activeTab === 'home' ? 'Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h1>
                    <p className="text-gray-500 dark:text-muted-foreground">
                      Welcome, <span className="text-gray-900 dark:text-white font-medium">{userData?.user?.name || "User"}</span>
                    </p>
                  </header>

                  {/* === TAB CONTENT: OVERVIEW === */}
                  {activeTab === "home" && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Requests" value={kpi.totalReqs} subtext="Billing cycle count" icon={Server} color="text-blue-500" />
                        <StatCard title="Success Rate" value={`${kpi.successRate}%`} subtext="Based on status codes" icon={CheckCircle} color="text-green-500" />
                        <StatCard title="Avg. Latency" value={`${kpi.avgLatency}ms`} subtext="Real-time average" icon={Clock} color="text-yellow-500" />
                        <StatCard title="Total Errors" value={kpi.errors} subtext="Failed requests" icon={AlertCircle} color="text-red-500" />
                      </div>

                      <div className="grid lg:grid-cols-3 gap-8">
                        {/* Traffic Chart */}
                        <div className="lg:col-span-2 rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 shadow-lg backdrop-blur-xl">
                          <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                            <Activity size={20} className="text-primary" />
                            Traffic Volume (Last 7 Days)
                          </h3>
                          <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartData}>
                                <defs>
                                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                  type="monotone"
                                  dataKey="requests"
                                  stroke="hsl(var(--primary))"
                                  strokeWidth={3}
                                  fillOpacity={1}
                                  fill="url(#colorReq)"
                                  name="Requests"
                                  animationDuration={1500}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Live Activity Log */}
                        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 shadow-lg backdrop-blur-xl flex flex-col">
                          <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                            <Server size={20} className="text-accent" />
                            Live Activity
                          </h3>
                          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                            {recentLogs.length === 0 ? (
                              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-muted-foreground py-10 opacity-50">
                                <Activity size={40} className="mb-4" />
                                <p className="text-sm">No recent activity.</p>
                              </div>
                            ) : (
                              recentLogs.map((log: any, i: number) => (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  key={i}
                                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/5 transition-all border border-gray-100 dark:border-white/5 group"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${(log.status || log.statusCode) >= 400 ? 'bg-red-500' : 'bg-green-500'}`} />
                                    <div>
                                      <p className="text-xs font-mono text-gray-900 dark:text-white truncate max-w-[120px] flex items-center gap-2">
                                        <span className="text-primary font-bold tracking-wider">{log.method || "POST"}</span>
                                        {log.endpoint || '/api/v1'}
                                      </p>
                                      <p className="text-[10px] text-gray-500 dark:text-muted-foreground mt-0.5">
                                        {formatSafe(log.createdAt || log.timestamp || log.date, 'HH:mm:ss')}
                                      </p>
                                    </div>
                                  </div>
                                  <span className={`text-xs font-mono font-bold ${log.latency > 500 ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                    {log.latency || 0}ms
                                  </span>
                                </motion.div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* === TAB CONTENT: ANALYTICS === */}
                  {activeTab === "analytics" && (
                    <div className="space-y-6">
                      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 shadow-lg backdrop-blur-xl">
                        <h3 className="font-display font-bold text-xl mb-6 text-gray-900 dark:text-white">Average Latency (ms)</h3>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="latency" name="Latency (ms)" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} animationDuration={1500} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                          <h3 className="font-display font-bold text-xl mb-6 text-gray-900 dark:text-white">Success Rate %</h3>
                          <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                                <XAxis dataKey="name" stroke="#888" fontSize={10} />
                                <YAxis domain={[0, 100]} stroke="#888" fontSize={10} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="successRate" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} animationDuration={2000} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                          <h3 className="font-display font-bold text-xl mb-6 text-gray-900 dark:text-white">Total Errors</h3>
                          <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                                <XAxis dataKey="name" stroke="#888" fontSize={10} />
                                <YAxis stroke="#888" fontSize={10} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="errors" fill="#ef4444" radius={[6, 6, 0, 0]} animationDuration={1500} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* === TAB CONTENT: API KEYS === */}
                  {activeTab === "api" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 dark:text-muted-foreground">Manage your secret keys. Do not share them.</p>
                        <button onClick={() => setModalOpen(true)} className="h-10 px-5 rounded-xl bg-primary text-black font-bold text-sm hover:opacity-90 flex items-center gap-2 shadow-lg hover:shadow-primary/30 transition-all">
                          <Plus size={16} /> Create New Key
                        </button>
                      </div>
                      <div className="grid gap-4">
                        {userData?.apiKeys?.length === 0 ? (
                          <div className="p-16 border border-dashed border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 rounded-3xl text-center text-gray-500 dark:text-muted-foreground flex flex-col items-center justify-center">
                            <Key size={32} className="mb-4 opacity-50" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No API Keys found</h3>
                            <p className="text-sm">Create a key to start making requests.</p>
                          </div>
                        ) : (
                          userData?.apiKeys?.map((key: any, i: number) => (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              key={key._id}
                              // Z-Index trick for dropdowns
                              className={`relative rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/80 dark:hover:bg-white/10 transition-colors ${openMenuId === key._id ? 'z-50' : 'z-0'}`}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">{key.name}</h3>
                                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${key.active ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${key.active ? 'bg-green-500' : 'bg-red-500'}`} />
                                    {key.active ? "Active" : "Inactive"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <code className="bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 px-4 py-2 rounded-xl text-xs font-mono text-gray-700 dark:text-gray-300">
                                    {key.key.slice(0, 12)}••••••••
                                  </code>
                                  <button onClick={() => copyToClipboard(key.key)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-white transition-colors" title="Copy Key"><Copy size={16} /></button>
                                </div>
                              </div>
                              <div className="relative">
                                <button onClick={() => setOpenMenuId(openMenuId === key._id ? null : key._id)} className="h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors"><MoreVertical size={20} /></button>
                                <AnimatePresence>
                                  {openMenuId === key._id && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                                      <button onClick={() => handleToggle(key._id)} className="w-full text-left px-5 py-3 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3"><Power size={14} /> Toggle State</button>
                                      <button onClick={() => handleDelete(key._id)} className="w-full text-left px-5 py-3 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-3"><Trash2 size={14} /> Delete</button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* === TAB CONTENT: DOWNLOAD === */}
                  {activeTab === "download" && (
                    <div className="rounded-[2.5rem] border border-gray-200 dark:border-white/10 bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-transparent p-10 relative overflow-hidden group shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        <div className="h-32 w-32 bg-primary rounded-[2rem] flex items-center justify-center shadow-[0_0_60px_-10px_rgba(var(--primary),0.6)] rotate-3 group-hover:rotate-6 transition-transform duration-500 overflow-hidden">
                          <img
                            src="/logo.png"
                            alt="Aanya Logo"
                            className="w-60 h-60 object-contain"
                          />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Aanya Desktop Client</h2>
                          <p className="text-gray-500 dark:text-muted-foreground text-lg mb-6">Experience the full power of voice control directly on your machine.</p>
                          <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
                            <span className="flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10 px-4 py-1.5 rounded-full border border-green-200 dark:border-green-400/20"><ShieldCheck size={14} /> Verified Safe</span>
                            <span className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-400/20">Windows 10/11</span>
                          </div>
                          <button className="h-14 px-10 rounded-2xl bg-primary text-black font-bold text-lg flex items-center gap-3 shadow-lg hover:scale-105 transition-transform">
                            <DownloadIcon size={22} /> Download v2.5.0
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab == "docs" && (
                    <div className="relative py-8">

                      {/* Subtle Static Background Gradient */}
                      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

                      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8">
                        {/* --- LEFT SIDEBAR (Sticky Navigation) --- */}
                        <div className="w-full md:w-64 flex-shrink-0">
                          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pr-2">

                            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-xl shadow-xl p-4 hidden md:block">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 px-2">Documentation</h3>
                              <nav className="space-y-1">
                                {DOCS_SECTIONS.map((section) => {
                                  const Icon = section.icon; // 👈 Assign to uppercase variable
                                  return (
                                    <button
                                      key={section.id}
                                      onClick={() => scrollToSection(section.id)}
                                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeDocSection === section.id
                                        ? "bg-primary text-black shadow-md shadow-primary/20"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                    >
                                      <Icon size={16} /> {/* 👈 Render the icon */}
                                      {section.label}
                                    </button>
                                  )
                                })}
                              </nav>
                            </div>
                          </div>
                        </div>

                        {/* --- RIGHT CONTENT AREA --- */}
                        <div className="flex-1 rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-xl shadow-2xl p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                          <div className="mb-12 border-b border-gray-200 dark:border-white/10 pb-8">
                            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Aanya API Documentation</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">The official guide to integrating and automating your system with Aanya AI.</p>
                          </div>

                          <div className="space-y-16">

                            {/* OVERVIEW */}
                            <section id="overview" className="scroll-mt-24">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><BookOpen className="text-primary" /> Overview</h2>
                              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                Aanya is an AI-powered automation assistant designed to combine conversational AI with secure API-based PC control. It supports Hinglish conversational AI, local system automation, application launching, Python execution, and features a secure multi-key API system with account-based rate limiting.
                              </p>

                              {/* IMPORTANT BETA/APP NOTICE */}
                              <div className="mt-6 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 p-5 rounded-2xl flex gap-4">
                                <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                                <div>
                                  <h4 className="font-bold text-yellow-800 dark:text-yellow-300 mb-1">Highly Recommended: Use the Desktop App</h4>
                                  <p className="text-sm text-yellow-700 dark:text-yellow-400/90 leading-relaxed">
                                    While Aanya provides this REST API, <strong>installing the official Desktop App is highly recommended</strong>. The API and the App are both currently in Beta, but the Desktop App has deeper system integrations, faster local execution, and bypasses standard HTTP timeout limits that can affect complex Python automations via the API.
                                  </p>
                                </div>
                              </div>
                            </section>

                            {/* ARCHITECTURE */}
                            <section id="architecture" className="scroll-mt-24">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Server className="text-primary" /> Architecture</h2>
                              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                                <li><strong>Backend:</strong> Node.js (Express) hosted on Render</li>
                                <li><strong>Database:</strong> MongoDB</li>
                                <li><strong>Authentication:</strong> JWT (30-day validity) & TOTP-based 2FA</li>
                                <li><strong>AI Model:</strong> Groq (llama-3.3-70b-versatile)</li>
                              </ul>
                              <p className="mt-4 text-gray-600 dark:text-gray-300">
                                The system uses account-based request tracking, an API key validation layer, rate limiting middleware, burst abuse detection, and structured logging for analytics.
                              </p>
                            </section>

                            {/* GETTING STARTED */}
                            <section id="getting-started" className="scroll-mt-24">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Zap className="text-primary" /> Getting Started</h2>
                              <div className="space-y-6">
                                <div>
                                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Base URLs</h3>
                                  <code className="block bg-gray-100 dark:bg-black/50 p-3 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-gray-300 mb-2">
                                    <span className="text-gray-500">Local:</span> http://localhost:5000<br />
                                    <span className="text-gray-500">Production:</span> https://aanya-backend.onrender.com
                                  </code>
                                </div>

                                <div>
                                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Step 1: Register</h3>
                                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono shadow-inner">
                                    <span className="text-blue-400">POST</span> /auth/register
                                    {JSON.stringify({ name: "Your Name", email: "you@example.com", password: "StrongPassword" }, null, 2)}
                                  </pre>
                                </div>

                                <div>
                                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Step 2: Login</h3>
                                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono shadow-inner mb-2">
                                    <span className="text-blue-400">POST</span> /auth/login
                                    // Returns:
                                    {JSON.stringify({ token: "JWT_ACCESS_TOKEN" }, null, 2)}
                                  </pre>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Use this token in protected routes via header: <code className="bg-gray-200 dark:bg-white/10 px-1 rounded text-primary">Authorization: Bearer YOUR_TOKEN</code></p>
                                </div>
                              </div>
                            </section>

                            {/* AUTH & KEYS */}
                            <section id="api-keys" className="scroll-mt-24">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Key className="text-primary" /> Authentication & API Keys</h2>
                              <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Aanya uses JWT Access Tokens (30 days validity), optional Google OAuth, and Authenticator App 2FA for dashboard access. However, for <strong>AI Command Execution</strong>, you must generate an API Key.
                              </p>
                              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                                <li>Generate multiple API keys via the dashboard.</li>
                                <li>Name, describe, toggle (active/inactive), and delete keys.</li>
                                <li>Pass the key in the header as <code className="text-primary">x-api-key: YOUR_API_KEY</code></li>
                                <li><strong>Note:</strong> Creating multiple keys does NOT increase your account's daily request limits.</li>
                              </ul>
                            </section>

                            {/* COMMAND API */}
                            <section id="ai-command-api" className="scroll-mt-24">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Terminal className="text-primary" /> AI Command API</h2>

                              <div className="mb-6">
                                <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 font-bold px-3 py-1 rounded-full text-xs mr-3">POST</span>
                                <code className="text-lg font-mono text-gray-900 dark:text-gray-200">/api/command</code>
                              </div>

                              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Request Body</h3>
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono shadow-inner mb-6">
                                {`{
  "command": "Open Spotify and play lo-fi music",
  "deviceId": "desktop-app-01",
  "groqKey": "optional_custom_key", 
  "email": "optional_email"
}`}
                              </pre>

                              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Response Format (JSON)</h3>
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono shadow-inner">
                                {`{
  "success": true,
  "reply": "Spotify khol diya aur lo-fi music play kar diya 🎵",
  "intents": [
    {
      "type": "APP",
      "action": "OPEN_APP",
      "payload": "spotify",
      "adFree": false
    }
  ]
}`}
                              </pre>
                            </section>

                            {/* AUTOMATION CAPABILITIES */}
                            <section id="pc-automation" className="scroll-mt-24">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Cpu className="text-primary" /> PC Automation Capabilities</h2>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                {[
                                  "Adjust volume and brightness", "Lock or sleep the system",
                                  "Take screenshots", "Type text automatically",
                                  "Create/delete folders", "Open specific apps (Spotify, Chrome)",
                                  "Launch websites", "Execute safe Python scripts",
                                  "Set alarms (thread-based)", "Play YouTube searches"
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/10">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-sm text-red-600 dark:text-red-400 italic">
                                * All automation is executed locally via the Python runtime. Long-running tasks may exceed hosting timeout limits if running strictly via the web API.
                              </p>
                            </section>

                            {/* RATE LIMITS */}
                            <section id="rate-limits" className="scroll-mt-24">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Activity className="text-primary" /> Rate Limits & Abuse Protection</h2>
                              <p className="text-gray-600 dark:text-gray-300 mb-4">Aanya uses strict account-based rate limiting to prevent abuse. Limits reset daily at <strong>00:00 IST</strong>.</p>

                              <div className="overflow-x-auto mb-6">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="border-b border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                                      <th className="py-3 px-4 font-bold">Plan Tier</th>
                                      <th className="py-3 px-4 font-bold">Daily Request Limit</th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-gray-600 dark:text-gray-300">
                                    <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5"><td className="py-3 px-4">Free</td><td className="py-3 px-4 font-mono">40</td></tr>
                                    <tr className="border-b border-gray-200 dark:border-white/10"><td className="py-3 px-4">Pro</td><td className="py-3 px-4 font-mono">100</td></tr>
                                    <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5"><td className="py-3 px-4">Developer</td><td className="py-3 px-4 font-mono">500</td></tr>
                                    <tr><td className="py-3 px-4">Custom</td><td className="py-3 px-4 font-mono">800</td></tr>
                                  </tbody>
                                </table>
                              </div>

                              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Abuse Protection System:</h3>
                              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                                <li><strong>Burst Limit:</strong> Max 30 requests per minute. Exceeding this triggers an immediate 1-hour temporary ban.</li>
                                <li><strong>Strike 1:</strong> Accumulating 3 warnings (exceeding daily limit) results in a Temporary Ban.</li>
                                <li><strong>Strike 2:</strong> Accumulating 5 Temporary Bans results in a Permanent Account Ban.</li>
                              </ul>
                            </section>

                            {/* LOGS */}
                            <section id="logs-analytics" className="scroll-mt-24">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Activity className="text-primary" /> Logs & Analytics</h2>
                              <p className="text-gray-600 dark:text-gray-300 mb-4">Each API request generates a comprehensive log for your dashboard analytics. We log:</p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {["User ID", "Endpoint", "Method", "Status Code", "Latency (ms)", "Device ID", "IP Address", "Account Usage Snapshot", "Plan Tier"].map((tag, i) => (
                                  <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">{tag}</span>
                                ))}
                              </div>
                            </section>

                            {/* SDK EXAMPLES */}
                            <section id="sdk-examples" className="scroll-mt-24">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Code2 className="text-primary" /> SDK / Code Examples</h2>

                              <div className="space-y-6">
                                <div>
                                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm uppercase tracking-wider">cURL</h3>
                                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono shadow-inner">
                                    {`curl -X POST https://aanya-backend.onrender.com/command \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{"command":"Open Notepad"}'`}
                                  </pre>
                                </div>

                                <div>
                                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm uppercase tracking-wider">Python</h3>
                                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono shadow-inner">
                                    {`import requests

url = "https://aanya-backend.onrender.com/command"
headers = {"x-api-key": "YOUR_API_KEY"}
data = {"command": "Open Chrome"}

response = requests.post(url, json=data, headers=headers)
print(response.json())`}
                                  </pre>
                                </div>

                                <div>
                                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm uppercase tracking-wider">JavaScript (Fetch)</h3>
                                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono shadow-inner">
                                    {`fetch("https://aanya-backend.onrender.com/command", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "YOUR_API_KEY"
  },
  body: JSON.stringify({ command: "Open Spotify" })
})
.then(res => res.json())
.then(data => console.log(data));`}
                                  </pre>
                                </div>
                              </div>
                            </section>

                            {/* LIMITATIONS */}
                            <section id="limitations" className="scroll-mt-24">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><AlertTriangle className="text-primary" /> Limitations (Beta Notice)</h2>
                              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                                <li><strong>No Conversation History:</strong> Each API request is treated as a fresh, zero-context command.</li>
                                <li><strong>No Streaming:</strong> Responses are only returned once the full JSON generation is complete.</li>
                                <li><strong>Fixed Model:</strong> The AI model is currently hardcoded to Groq's <code className="bg-gray-100 dark:bg-white/10 px-1 rounded text-sm">llama-3.3-70b-versatile</code>.</li>
                                <li><strong>Timeout Limits:</strong> Render free tier has a strict 100-second timeout limit.</li>
                                <li><strong>Key Restrictions:</strong> IP-based restrictions per key are planned but not yet implemented.</li>
                              </ul>
                            </section>

                            {/* ROADMAP */}
                            <section id="roadmap" className="scroll-mt-24">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Zap className="text-primary" /> Roadmap</h2>
                              <p className="text-gray-600 dark:text-gray-300 mb-4">We are actively developing Aanya. Here is what is coming next:</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {["Paid tiers via Razorpay", "Webhooks", "Model Selection", "Advanced Key Restrictions", "Conversation Memory", "Team Accounts"].map((feature, i) => (
                                  <div key={i} className="bg-primary/10 border border-primary/20 text-primary text-center py-3 px-4 rounded-xl font-medium text-sm">
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            </section>

                          </div>
                        </div>
                      </div>
                    </div>

                  )}
                  {/* === TAB CONTENT: SETTINGS === */}
                  {activeTab === "settings" && (
                    <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full">

                      {/* --- SETTINGS SIDEBAR NAVIGATION --- */}
                      <div className="w-full md:w-64 shrink-0 flex flex-col space-y-2">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white px-2">Settings</h2>

                        {[
                          { id: "profile", label: "Profile", icon: User },
                          { id: "security", label: "Security", icon: Shield },
                          // { id: "personalization", label: "Personalization", icon: Palette },
                          // { id: "api-usage", label: "API & Usage", icon: Key },
                          { id: "billing", label: "Billing", icon: CreditCard },
                          // { id: "privacy", label: "Privacy", icon: Lock },
                        ].map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeSettingTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveSettingTab(tab.id)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${isActive
                                ? "bg-primary text-black shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)]"
                                : "text-gray-500 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                                }`}
                            >
                              <Icon size={18} />
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* --- SETTINGS CONTENT PANELS --- */}
                      <div className="flex-1 max-w-3xl">

                        {/* 1. PROFILE TAB (Your original code) */}
                        {activeSettingTab === "profile" && (
                          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 sm:p-10 backdrop-blur-xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Profile Settings</h3>
                            <div className="space-y-6">
                              <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-muted-foreground mb-2 ml-1">Name</label>
                                <input readOnly value={userData?.user?.name || ""} className="w-full h-12 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary/50" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-muted-foreground mb-2 ml-1">Email Address</label>
                                <input readOnly value={userData?.user?.email || ""} className="w-full h-12 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-5 text-sm text-gray-500 dark:text-muted-foreground cursor-not-allowed" />
                              </div>

                              {/* LOGOUT SECTION */}
                              <div className="pt-4">
                                <button
                                  onClick={() => setShowLogoutConfirm(true)}
                                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-95"
                                >
                                  <Power size={16} className="text-primary" />
                                  Logout
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. SECURITY TAB */}
                        {activeSettingTab === "security" && (
                          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* HEADER */}
                            <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 backdrop-blur-xl shadow-xl">
                              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Security & Access</h3>
                              <p className="text-gray-500 dark:text-muted-foreground text-sm">Manage your password, active sessions, and account protection settings.</p>
                            </div>

                            {/* 🔐 PASSWORD CHANGE */}
                            <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 backdrop-blur-xl shadow-xl">
                              <h4 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                                <Key size={18} className="text-primary" /> Change Password
                              </h4>
                              {userData?.user?.googleId ? (
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-2xl text-yellow-800 dark:text-yellow-200 text-sm">
                                  You are logged in using Google. Password changes are managed through your Google account.
                                </div>
                              ) : (
                                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                  <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 ml-1">Current Password</label>
                                    <input
                                      type="password"
                                      value={currentPassword}
                                      onChange={e => setCurrentPassword(e.target.value)}
                                      placeholder="••••••••"
                                      className="w-full h-12 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary/50"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2 ml-1">New Password</label>
                                    <input
                                      type="password"
                                      value={newPassword}
                                      onChange={e => setNewPassword(e.target.value)}
                                      placeholder="••••••••"
                                      className="w-full h-12 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary/50"
                                    />
                                  </div>
                                  <button type="submit" disabled={isUpdatingPassword} className="px-6 py-3 bg-primary text-black rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 mt-2 disabled:opacity-50">
                                    {isUpdatingPassword ? "Updating..." : "Update Password"}
                                  </button>
                                </form>
                              )}
                            </div>

                            {/* ⚠️ ACCOUNT PROTECTION (2FA) */}
                            <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                                  <ShieldAlert size={18} className={userData?.user?.isTwoFactorEnabled ? "text-green-500" : "text-primary"} />
                                  Two-Factor Authentication (2FA)
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-muted-foreground">Add an extra layer of security to your account.</p>
                              </div>

                              {userData?.user?.isTwoFactorEnabled ? (
                                <span className="px-4 py-2 bg-green-500/10 text-green-600 font-bold rounded-xl text-sm border border-green-500/20">Active</span>
                              ) : (
                                <button onClick={handleSetup2FA} className="px-6 py-3 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                                  Enable 2FA
                                </button>
                              )}
                            </div>

                            {/* 🖥 ACTIVE SESSIONS */}
                            <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 backdrop-blur-xl shadow-xl">
                              <h4 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                                <Monitor size={18} className="text-primary" /> Active Sessions
                              </h4>
                              <div className="space-y-4">
                                {userData?.user?.sessions?.length > 0 ? (
                                  userData.user.sessions.map((session: any) => (
                                    <div key={session.sessionId} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 gap-4">
                                      <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{session.device || "Unknown Device"}</p>
                                        <p className="text-xs text-gray-500 mt-1">IP: {session.ip} • Logged in: {formatSafe(session.createdAt)}</p>
                                      </div>
                                      <button onClick={() => handleRevokeSession(session.sessionId)} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors px-4 py-2 bg-red-50 dark:bg-red-500/10 rounded-lg">
                                        Revoke Session
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">No active remote sessions tracked.</p>
                                )}
                              </div>
                            </div>

                            {/* 🗑 DELETE ACCOUNT */}
                            <div className="rounded-3xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-8 backdrop-blur-xl">
                              <h4 className="text-red-600 dark:text-red-400 font-bold mb-3 flex items-center gap-2 text-lg">
                                <AlertTriangle size={20} /> Danger Zone
                              </h4>
                              <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-6 max-w-2xl">
                                Permanently delete your account, API keys, and all generated logs. This action is irreversible.
                              </p>
                              <button onClick={handleAccountDelete} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95">
                                Delete Account
                              </button>
                            </div>

                            {/* 2FA MODAL */}
                            <AnimatePresence>
                              {show2FAModal && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                                  <div className="bg-white dark:bg-[#111] p-8 rounded-3xl max-w-md w-full text-center border border-gray-200 dark:border-white/10 shadow-2xl relative">
                                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Protect Your Account</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                      Step 1: Download <span className="font-bold text-gray-700 dark:text-gray-300">Google Authenticator</span> or <span className="font-bold text-gray-700 dark:text-gray-300">Authy</span> from your app store.<br />
                                      Step 2: Scan the QR code below.
                                    </p>

                                    <div className="bg-white p-3 rounded-2xl border border-gray-200 inline-block mb-6 shadow-sm">
                                      <img src={qrCodeUrl} alt="2FA QR" className="w-48 h-48" />
                                    </div>

                                    <div className="mb-6 text-left">
                                      <p className="text-xs font-bold uppercase text-gray-500 mb-2 ml-1">Can't scan the code?</p>
                                      <div className="flex items-center gap-2">
                                        <code className="flex-1 p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-mono text-gray-700 dark:text-gray-300 text-center tracking-wider">
                                          {setupSecret}
                                        </code>
                                        <button
                                          onClick={() => navigator.clipboard.writeText(setupSecret)}
                                          className="p-3 bg-gray-100 dark:bg-white/10 rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-gray-600 dark:text-gray-300"
                                          title="Copy Code"
                                        >
                                          <Copy size={16} />
                                        </button>
                                      </div>
                                    </div>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                      Step 3: Enter the 6-digit PIN generated by the app.
                                    </p>

                                    <input
                                      type="text"
                                      maxLength={6}
                                      placeholder="000000"
                                      value={twoFactorPin}
                                      onChange={e => setTwoFactorPin(e.target.value.replace(/\D/g, ''))} // Forces numbers only
                                      className="w-full h-14 text-center text-3xl tracking-[1em] font-mono font-bold bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl mb-6 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                    />

                                    <div className="flex gap-3">
                                      <button
                                        onClick={() => {
                                          setShow2FAModal(false);
                                          setTwoFactorPin("");
                                        }}
                                        className="flex-1 py-3.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={handleVerify2FA}
                                        disabled={twoFactorPin.length !== 6}
                                        className="flex-1 py-3.5 rounded-xl bg-primary text-black font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                                      >
                                        Verify & Enable
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </AnimatePresence>

                          </div>
                        )}

                        {/* 3. PERSONALIZATION TAB */}
                        {activeSettingTab === "personalization" && (
                          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 sm:p-10 backdrop-blur-xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Personalization</h3>
                            <p className="text-gray-500 dark:text-muted-foreground">Adjust your AI preferences, tone, and themes.</p>
                            {/* Add theme toggles or Aanya AI tone settings here */}
                          </div>
                        )}


                        {/* 5. BILLING TAB */}
                        {activeSettingTab === "billing" && (
                          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 sm:p-10 backdrop-blur-xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Billing & Plans</h3>
                            <p className="text-gray-500 dark:text-muted-foreground">You are currently on the <span className="font-bold text-primary uppercase">{userData?.user?.plan || "Free"}</span> plan.</p>
                            {/* Add upgrade/Stripe buttons here */}
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                </motion.div>
              )}

            </main>
          </div>

          {/* --- MODAL (CREATE KEY) --- */}
          <AnimatePresence>
            {modalOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] w-full max-w-md p-8 shadow-2xl relative">
                  <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-black dark:hover:text-white transition-colors"><X size={20} /></button>
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/20 text-primary"><Sparkles size={20} /></div>
                    New API Key
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 ml-1">Generate a secure key for your application.</p>

                  <form onSubmit={handleGenerate} className="space-y-5">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2 block">Friendly Name <span className="text-primary">*</span></label>
                      <input type="text" autoFocus placeholder="e.g. Production App" value={keyName} onChange={e => setKeyName(e.target.value)} className="w-full h-12 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2 block">Description</label>
                      <input type="text" placeholder="For backend services..." value={keyDesc} onChange={e => setKeyDesc(e.target.value)} className="w-full h-12 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
                    </div>
                    <div className="pt-4">
                      <button type="submit" disabled={generating || !keyName} className="w-full h-12 rounded-2xl bg-primary text-black font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {generating ? <Loader2 className="animate-spin" size={20} /> : "Generate Key"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

      )

      }
      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-sm w-full bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl text-center"
            >
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Power size={32} className="text-primary" />
              </div>

              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Logging out?</h3>
              <p className="text-gray-500 dark:text-muted-foreground mb-8">Are you sure you want to end your session? You will need to login again to access your keys.</p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="h-12 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="h-12 rounded-2xl bg-primary text-black font-bold text-sm hover:opacity-90 shadow-lg shadow-primary/20 transition-all"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}