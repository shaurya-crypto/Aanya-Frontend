import React, { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Terminal, Shield, Cpu, Code2, AlertTriangle, Zap, Server, Activity, Key } from "lucide-react";
import { Link } from "react-router-dom";

const DOCS_SECTIONS = [
  { id: "overview", label: "Overview", icon: <BookOpen size={16} /> },
  { id: "architecture", label: "Architecture", icon: <Server size={16} /> },
  { id: "getting-started", label: "Getting Started", icon: <Zap size={16} /> },
  { id: "authentication", label: "Authentication", icon: <Shield size={16} /> },
  { id: "api-keys", label: "API Keys", icon: <Key size={16} /> },
  { id: "ai-command-api", label: "AI Command API", icon: <Terminal size={16} /> },
  { id: "pc-automation", label: "PC Automation", icon: <Cpu size={16} /> },
  { id: "rate-limits", label: "Rate Limits", icon: <Activity size={16} /> },
  { id: "logs-analytics", label: "Logs & Analytics", icon: <Activity size={16} /> },
  { id: "sdk-examples", label: "SDK / Examples", icon: <Code2 size={16} /> },
  { id: "limitations", label: "Limitations (Beta)", icon: <AlertTriangle size={16} /> },
  { id: "roadmap", label: "Roadmap", icon: <Zap size={16} /> }
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState("overview");

  // Theme check for standardizing the background
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100; // Offset for header
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020205] text-gray-900 dark:text-foreground font-sans selection:bg-primary/30 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Subtle Static Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8">
        
        {/* --- LEFT SIDEBAR (Sticky Navigation) --- */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-white/50 dark:bg-white/5 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 backdrop-blur-md mb-8"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-xl shadow-xl p-4 hidden md:block">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 px-2">Documentation</h3>
              <nav className="space-y-1">
                {DOCS_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeSection === section.id 
                        ? "bg-primary text-black shadow-md shadow-primary/20" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {section.icon}
                    {section.label}
                  </button>
                ))}
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><BookOpen className="text-primary"/> Overview</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Server className="text-primary"/> Architecture</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Zap className="text-primary"/> Getting Started</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Base URLs</h3>
                  <code className="block bg-gray-100 dark:bg-black/50 p-3 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-gray-300 mb-2">
                    <span className="text-gray-500">Local:</span> http://localhost:5000<br/>
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Key className="text-primary"/> Authentication & API Keys</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Terminal className="text-primary"/> AI Command API</h2>
              
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Cpu className="text-primary"/> PC Automation Capabilities</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Activity className="text-primary"/> Rate Limits & Abuse Protection</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Activity className="text-primary"/> Logs & Analytics</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Each API request generates a comprehensive log for your dashboard analytics. We log:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["User ID", "Endpoint", "Method", "Status Code", "Latency (ms)", "Device ID", "IP Address", "Account Usage Snapshot", "Plan Tier"].map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">{tag}</span>
                ))}
              </div>
            </section>

            {/* SDK EXAMPLES */}
            <section id="sdk-examples" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Code2 className="text-primary"/> SDK / Code Examples</h2>
              
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><AlertTriangle className="text-primary"/> Limitations (Beta Notice)</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Zap className="text-primary"/> Roadmap</h2>
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
  );
}