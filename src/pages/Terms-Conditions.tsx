import React, { useEffect, useState } from "react";
import { ArrowLeft, FileText, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsAndConditions() {
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
              <FileText size={32} />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Terms & Conditions
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p className="mb-3">
                Welcome to Aanya (“we,” “our,” or “us”). By accessing or using Aanya’s website, desktop application, API services, or any related services (collectively, the “Service”), you agree to be bound by these Terms & Conditions.
              </p>
              <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 font-medium">
                If you do not agree to these Terms, you must not use the Service.
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">2. Description of Service</h2>
              <p className="mb-3">
                Aanya is an AI-powered assistant and API platform that provides automated responses and AI-based processing through integrated third-party AI providers, including but not limited to Groq and ChatGPT APIs.
              </p>
              <p className="text-sm italic text-gray-500 dark:text-gray-400 border-l-2 border-primary pl-3">
                The Service is currently in beta and may be updated, modified, or discontinued at any time without prior notice.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">3. Eligibility</h2>
              <p className="mb-2">The Service is available to users globally. By using Aanya, you confirm that:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>You are legally permitted to use online services in your jurisdiction.</li>
                <li>If you are under 13 years of age, you use the Service under parental or guardian supervision where required by law.</li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We reserve the right to restrict access in certain regions if required by legal or regulatory obligations.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">4. Account Registration</h2>
              <p className="mb-2">To access certain features, you must create an account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Provide accurate and complete information (name, email, etc.).</li>
                <li>Maintain the confidentiality of your login credentials.</li>
                <li>Be responsible for all activities under your account.</li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Passwords are securely hashed, and we implement reasonable security measures. However, you are responsible for safeguarding your credentials.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">5. Acceptable Use</h2>
              <p className="mb-2">You agree not to use Aanya to:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Violate any applicable law or regulation.</li>
                <li>Generate illegal, harmful, abusive, or fraudulent content.</li>
                <li>Attempt to exploit, reverse engineer, or disrupt the Service.</li>
                <li>Bypass usage limits, rate limits, or security mechanisms.</li>
                <li>Use automated scripts to overload the system.</li>
                <li>Engage in spam, phishing, or malicious activities.</li>
              </ul>
              
              <p className="mb-2 mt-6 font-medium text-gray-800 dark:text-gray-200">Violation of these terms may result in:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-500 dark:text-gray-400">
                <li>Temporary suspension</li>
                <li>Permanent account ban</li>
                <li>API access revocation</li>
                <li>Legal action if necessary</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">6. API Usage & Rate Limits</h2>
              <p className="mb-2">Aanya enforces account-based usage limits. Limits may vary by plan (Free, Pro, Developer, Custom).</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Usage is tracked per account.</li>
                <li>Creating multiple API keys does not increase your limit.</li>
                <li>Excessive or abusive usage may trigger temporary suspension or permanent banning.</li>
              </ul>
              <p className="font-medium text-gray-800 dark:text-gray-200">We reserve the right to modify rate limits at any time.</p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">7. AI-Generated Content Disclaimer</h2>
              <p className="mb-2">Aanya provides AI-generated responses. By using the Service, you acknowledge:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>AI responses may contain inaccuracies.</li>
                <li>AI outputs are generated automatically and do not constitute professional advice.</li>
                <li>You are solely responsible for how you use the output.</li>
              </ul>
              <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-gray-300">
                We do not guarantee accuracy, reliability, or suitability of AI-generated content for legal, medical, financial, or professional use.
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">8. Third-Party Services</h2>
              <p className="mb-2">Aanya may integrate third-party AI providers such as Groq and ChatGPT. By using the Service, you acknowledge that:</p>
              <ul className="list-disc pl-6 space-y-1 mb-2">
                <li>Certain requests may be processed by third-party providers.</li>
                <li>Their own terms and privacy policies may apply.</li>
              </ul>
              <p className="text-sm text-gray-500">We are not responsible for outages or disruptions caused by third-party services.</p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">9. Intellectual Property</h2>
              <p className="mb-3">
                All branding, design, structure, and software related to Aanya are the intellectual property of the project owner unless otherwise stated.
              </p>
              <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">You may not:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Copy, reproduce, or redistribute platform code.</li>
                <li>Resell access without permission.</li>
                <li>Use Aanya’s branding without written consent.</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">10. Suspension & Termination</h2>
              <p className="mb-2">We reserve the right to suspend or terminate your account if:</p>
              <ul className="list-disc pl-6 space-y-1 mb-3">
                <li>You violate these Terms.</li>
                <li>You engage in abusive or malicious behavior.</li>
                <li>You attempt to bypass system protections.</li>
                <li>Required by legal authority.</li>
              </ul>
              <p className="text-sm text-gray-500">Termination may occur without prior notice in severe cases.</p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">11. Limitation of Liability</h2>
              <p className="mb-2">To the maximum extent permitted by law:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Aanya is provided “as is” without warranties of any kind.</li>
                <li>We are not liable for indirect, incidental, or consequential damages.</li>
                <li>We are not responsible for losses resulting from AI-generated outputs.</li>
                <li>We are not liable for service interruptions, downtime, or data loss.</li>
              </ul>
              <p className="font-bold text-gray-900 dark:text-white">Use the Service at your own risk.</p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">12. Future Payments & Subscriptions</h2>
              <p className="mb-2">Paid plans may be introduced in the future through third-party payment processors such as Razorpay.</p>
              <ul className="list-disc pl-6 space-y-1 mb-2">
                <li>We do not currently store payment details.</li>
                <li>Future subscription terms will be governed by separate billing policies.</li>
              </ul>
            </section>

            {/* Sections 13, 14, 15 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">13. Modifications to Terms</h2>
                <p className="text-sm">We may update these Terms & Conditions at any time. Continued use of the Service after updates constitutes acceptance of the revised Terms.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">14. Privacy</h2>
                <p className="text-sm">Your use of Aanya is also governed by our <a href="/privacy-policy" className="text-primary hover:underline font-bold">Privacy Policy</a>.</p>
              </section>

              <section className="md:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">15. Governing Law</h2>
                <p className="text-sm">These Terms shall be governed by and interpreted in accordance with the applicable laws of the jurisdiction in which the project operator resides, without regard to conflict of law principles.</p>
              </section>
            </div>

            {/* Section 16 */}
            <section className="bg-gray-100 dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10 mt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">16. Contact Information</h2>
              <p className="mb-4">For questions regarding these Terms & Conditions, please contact:</p>
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