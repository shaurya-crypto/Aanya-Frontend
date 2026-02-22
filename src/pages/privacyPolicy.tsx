import React, { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020205] text-gray-900 dark:text-foreground font-sans selection:bg-primary/30 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Subtle Static Background Gradient (No heavy animations) */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Navigation Bar */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-white/50 dark:bg-white/5 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 backdrop-blur-md"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-xl shadow-2xl p-8 md:p-12 lg:p-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-white/10 pb-8 mb-8 text-center md:text-left">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-6">
              <ShieldCheck size={32} />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm text-gray-500 dark:text-gray-400">
              <p><span className="font-bold">Project Name:</span> Aanya</p>
              <p className="hidden md:block">•</p>
              <p><span className="font-bold">Effective Date:</span> February 21, 2026</p>
            </div>
          </div>

          {/* Policy Text Content */}
          <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">1. Introduction</h2>
              <p className="mb-3">
                Welcome to Aanya (“we,” “our,” or “us”). Aanya is an individual AI-powered assistant project designed to provide intelligent responses and API-based AI services to users globally.
              </p>
              <p className="mb-3">
                We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your data when you use Aanya’s website, desktop application, and API services.
              </p>
              <p className="flex items-center gap-2 mt-4 text-gray-900 dark:text-gray-200 font-medium">
                If you have any questions regarding this Privacy Policy, you may contact us at:
              </p>
              <a href="mailto:shauryaprabhakar097@gmail.com" className="inline-flex items-center gap-2 mt-2 text-primary hover:underline font-bold">
                <Mail size={16} /> shauryaprabhakar097@gmail.com
              </a>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
              <p className="mb-6">We collect information necessary to provide and improve our services.</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">2.1 Account Information</h3>
                  <p className="mb-2">When you create an account, we collect:</p>
                  <ul className="list-disc pl-6 space-y-1 mb-2">
                    <li>Full Name</li>
                    <li>Email Address</li>
                    <li>Password (securely hashed)</li>
                  </ul>
                  <p className="text-sm italic border-l-2 border-primary pl-3 text-gray-500">Passwords are never stored in plain text.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">2.2 Onboarding Information</h3>
                  <p className="mb-2">To personalize your experience, we may collect:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Country</li>
                    <li>City</li>
                    <li>Profession</li>
                    <li>Interests</li>
                    <li>Other optional profile information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">2.3 Usage & Technical Information</h3>
                  <p className="mb-2">To ensure security and service quality, we collect:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>API usage data</li>
                    <li>Request logs</li>
                    <li>IP address</li>
                    <li>Device identifier</li>
                    <li>Session activity</li>
                    <li>Endpoint usage and latency data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">2.4 Cookies</h3>
                  <p className="mb-2">We use session cookies to:</p>
                  <ul className="list-disc pl-6 space-y-1 mb-2">
                    <li>Maintain login sessions</li>
                    <li>Improve security</li>
                    <li>Ensure smooth platform functionality</li>
                  </ul>
                  <p className="text-sm italic border-l-2 border-primary pl-3 text-gray-500">We do not use tracking or advertising cookies at this time.</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">3. AI & Data Processing</h2>
              <p className="mb-3">Aanya functions as an AI agent and may process user prompts to generate responses.</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>User prompts and AI responses are not permanently stored.</li>
                <li>We do not use your content to train AI models.</li>
                <li>
                  Some AI processing may be handled through third-party providers such as:
                  <ul className="list-circle pl-6 mt-1 space-y-1 text-gray-500 dark:text-gray-400">
                    <li>Groq</li>
                    <li>ChatGPT (via API)</li>
                  </ul>
                </li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                These providers process data only to generate responses and are bound by their own privacy and security policies.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">4. How We Use Your Information</h2>
              <p className="mb-2">We use collected information to:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Provide AI and API services</li>
                <li>Enforce usage limits and prevent abuse</li>
                <li>Improve platform stability and performance</li>
                <li>Maintain account security</li>
                <li>Detect suspicious or fraudulent activity</li>
                <li>Provide future service updates</li>
              </ul>
              <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10 font-medium text-gray-800 dark:text-gray-200">
                We do not sell or rent your personal data to third parties.
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">5. Security Measures</h2>
              <p className="mb-2">We implement strong security measures to protect your information, including:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Secure password hashing (bcrypt)</li>
                <li>JWT-based authentication</li>
                <li>HTTPS encryption</li>
                <li>Two-Factor Authentication (2FA) support</li>
                <li>IP-based abuse monitoring</li>
                <li>Rate limiting and security logging</li>
              </ul>
              <p className="text-sm italic text-gray-500">
                While we take reasonable security precautions, no system is completely immune from risk.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">6. Account Protection & Monitoring</h2>
              <p className="mb-2">To maintain platform integrity, we may:</p>
              <ul className="list-disc pl-6 space-y-1 mb-3">
                <li>Temporarily suspend accounts for abuse</li>
                <li>Permanently ban accounts engaging in harmful activity</li>
                <li>Log security events and suspicious activity</li>
              </ul>
              <p>These measures help ensure fairness and reliability for all users.</p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">7. Payments (Future Plans)</h2>
              <p className="mb-3">Aanya may introduce paid plans in the future using third-party payment processors such as Razorpay.</p>
              <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">At this time:</p>
              <ul className="list-disc pl-6 space-y-1 mb-3">
                <li>We do not store payment information.</li>
                <li>All payment processing will be handled securely by the selected payment provider.</li>
              </ul>
              <p className="text-sm text-gray-500">When payment features are launched, this policy will be updated accordingly.</p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">8. User Rights</h2>
              <p className="mb-2">You may:</p>
              <ul className="list-disc pl-6 space-y-1 mb-3">
                <li>Access your account information</li>
                <li>Update your profile details</li>
                <li>Delete your account</li>
              </ul>
              <p className="text-sm text-gray-500">
                At this time, automated data export and formal deletion requests are not yet implemented but may be introduced in future updates.
              </p>
            </section>

            {/* Sections 9, 10, 11 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">9. Age Policy</h2>
                <p className="text-sm">Aanya is accessible to users of all age groups. However, users under the age of 13 should use the service under parental guidance where required by local laws.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">10. Global Users</h2>
                <p className="text-sm">Aanya is available globally. By using the service, you consent to the processing of your information in accordance with this Privacy Policy.</p>
              </section>
            </div>

            {/* Section 11 & 12 */}
            <section className="pt-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">11. Beta Status</h2>
              <p>
                Aanya is currently in beta. Features, policies, and services may evolve. We may update this Privacy Policy as the platform grows. Continued use of the service after updates constitutes acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">12. Changes to This Privacy Policy</h2>
              <p>We may revise this Privacy Policy periodically. Updates will be reflected with a revised “Effective Date.”</p>
            </section>

            {/* Section 13 */}
            <section className="bg-gray-100 dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10 mt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">13. Contact Information</h2>
              <p className="mb-4">If you have any privacy-related concerns or inquiries, please contact:</p>
              <a href="mailto:shauryaprabhakar097@gmail.com" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                <Mail size={18} /> shauryaprabhakar097@gmail.com
              </a>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}