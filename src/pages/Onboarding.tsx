import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import SplashScreen from "../components/SplashScreen";

// --- PROFESSIONAL RADIANT BACKGROUND ---
const RadiantBackground = () => (
  <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-slate-50 dark:bg-[#020203] transition-colors duration-500" />
    <div className="absolute inset-0 bg-radiant-mesh radiant-dark hidden dark:block mix-blend-screen opacity-40" />
    <div className="absolute inset-0 bg-radiant-mesh radiant-light dark:hidden opacity-20" />
    <div className="absolute inset-0 noise-overlay opacity-[0.03]" />
  </div>
);


const CustomSelect = ({ label, options, value, onChange, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full h-12 rounded-xl px-4 flex items-center justify-between cursor-pointer transition-all
          bg-white/80 dark:bg-white/5 border border-slate-300 dark:border-white/10
          hover:border-primary/50 group
          ${isOpen ? "ring-1 ring-primary/50 border-primary/50" : ""}
        `}
      >
        <span className={`text-sm ${value ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute z-[100] w-full bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-none backdrop-blur-xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5">
              {options.map((opt: string) => (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`
                    px-4 py-3 text-sm rounded-xl cursor-pointer transition-colors mb-0.5 last:mb-0
                    ${value === opt
                      ? "bg-primary text-black font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    }
                  `}
                >
                  {opt}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    country: "",
    city: "",
    language: "English",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    profession: "",
    primaryGoal: "",
    interests: [] as string[],
    expLevel: "",
    referral: "",
    aiHelp: "",
    tone: "Friendly",
    bio: "",
  });

  const interestsList = [
    "Artificial Intelligence", "Software Engineering", "Music Production",
    "Data Science", "Finance", "Cybersecurity", "Productivity"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      setTimeout(() => setShowContent(true), 800);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- NAVIGATION ---
  const nextStep = () => { if (isStepValid()) setStep((s) => s + 1); };
  const prevStep = () => { setStep((s) => s - 1); };

  // --- MANDATORY VALIDATION (1, 2, 3) ---
  const isStepValid = () => {
    if (step === 1) return formData.country !== "" && formData.city.trim() !== "";
    if (step === 2) return formData.profession !== "" && formData.expLevel !== "" && formData.primaryGoal !== "";
    if (step === 3) return formData.aiHelp.length >= 5 && formData.referral !== "" && formData.interests.length > 0;
    return true;
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://aanya-backend.onrender.com/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData) // Send all their answers to the backend
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      // If successful, go to dashboard!
      navigate("/dashboard");

    } catch (error) {
      console.error("Onboarding submission failed:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false); // Let them try again
    }
  };

  return (
    <Layout hideFooter>
      <AnimatePresence>
        {pageLoading && <SplashScreen />}
      </AnimatePresence>

      <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-transparent font-sans">

        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex flex-col items-center justify-center p-6 min-h-screen"
          >
            <RadiantBackground />

            <div className="w-full max-w-xl relative">

              {/* Progress Tracker */}
              <div className="flex items-center justify-between mb-10 px-2">
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-700 ${step >= i ? 'w-10 bg-primary' : 'w-4 bg-slate-300 dark:bg-slate-800'}`} />
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Configuration Phase 0{step}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="bg-white/90 dark:bg-[#08080a]/80 border border-slate-200 dark:border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 dark:shadow-none backdrop-blur-3xl"
                >
                  {/* PHASE 1: REGIONAL IDENTIFICATION */}
                  {step === 1 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">Region Sync</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 font-medium tracking-tight">Synchronize regional protocols for system optimization.</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <CustomSelect
                          label="Target Country"
                          placeholder="Select Region"
                          options={["India", "United States", "United Kingdom", "Canada", "Germany"]}
                          value={formData.country}
                          onChange={(val: string) => setFormData({ ...formData, country: val })}
                        />
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">City</label>
                          <input
                            placeholder="Current City"
                            value={formData.city}
                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                            className="w-full h-12 rounded-xl px-4 text-sm outline-none transition-all bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:border-primary/50"
                          />
                        </div>
                      </div>

                      <CustomSelect
                        label="Linguistic Preference"
                        placeholder="System Language"
                        options={["English", "Hindi", "Spanish", "French"]}
                        value={formData.language}
                        onChange={(val: string) => setFormData({ ...formData, language: val })}
                      />

                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Detected Zone: {formData.timezone}</span>
                      </div>
                    </div>
                  )}

                  {/* PHASE 2: IDENTITY MATRIX */}
                  {step === 2 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">Identity Matrix</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 font-medium tracking-tight">Optimizing behavioral algorithms based on profile identity.</p>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Designation</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['Student', 'Developer', 'Business', 'Other'].map(p => (
                            <button
                              key={p}
                              onClick={() => setFormData({ ...formData, profession: p })}
                              className={`h-12 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all ${formData.profession === p ? 'bg-slate-900 dark:bg-primary border-slate-900 dark:border-primary text-white dark:text-black' : 'border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      <CustomSelect
                        label="Primary Workflow Objective"
                        placeholder="Select Goal"
                        options={["System Automation", "Personal Productivity", "Software Development", "Creative Research"]}
                        value={formData.primaryGoal}
                        onChange={(val: string) => setFormData({ ...formData, primaryGoal: val })}
                      />

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Technical Expertise</label>
                        <div className="flex gap-3">
                          {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                            <button
                              key={l}
                              onClick={() => setFormData({ ...formData, expLevel: l })}
                              className={`flex-1 h-12 rounded-xl border text-[10px] font-black uppercase transition-all ${formData.expLevel === l ? 'bg-slate-900 dark:bg-primary border-slate-900 dark:border-primary text-white dark:text-black' : 'border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PHASE 3: STRATEGY & INTENT */}
                  {step === 3 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">Strategy Mode</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 font-medium tracking-tight">Defining the core interaction framework for Aanya AI.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Persona Interaction Tone</label>
                          <div className="flex gap-3">
                            {['Friendly', 'Formal', 'Concise'].map(t => (
                              <button
                                key={t}
                                onClick={() => setFormData({ ...formData, tone: t })}
                                className={`flex-1 h-12 rounded-xl border text-[10px] font-black uppercase transition-all ${formData.tone === t ? 'bg-slate-900 dark:bg-primary border-slate-900 dark:border-primary text-white dark:text-black' : 'border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <CustomSelect
                          label="Referral Discovery Channel"
                          placeholder="Source"
                          options={["Social Media", "GitHub Repository", "Developer Community", "Word of Mouth"]}
                          value={formData.referral}
                          onChange={(val: string) => setFormData({ ...formData, referral: val })}
                        />

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Areas of Interest (Required)</label>
                          <div className="flex flex-wrap gap-2">
                            {interestsList.map(i => (
                              <button
                                key={i}
                                onClick={() => handleInterestToggle(i)}
                                className={`px-4 py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${formData.interests.includes(i) ? 'bg-slate-900 dark:bg-primary border-slate-900 dark:border-primary text-white dark:text-black' : 'border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-primary/50'}`}
                              >
                                {i}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Usage Specification</label>
                          <textarea
                            placeholder="Describe how Aanya AI will be integrated into your routine..."
                            value={formData.aiHelp}
                            onChange={e => setFormData({ ...formData, aiHelp: e.target.value })}
                            className="w-full bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-2xl p-4 text-sm text-slate-900 dark:text-white outline-none focus:border-primary/50 transition-all resize-none h-24"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PHASE 4: REFINEMENT (OPTIONAL) */}
                  {step === 4 && (
                    <div className="space-y-8 text-center">
                      <div>
                        <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">Refinement</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 font-medium tracking-tight">Identity enrichment parameters for a personalized experience.</p>
                      </div>

                      <div className="flex flex-col items-center gap-10 py-6">
                        <div className="h-32 w-32 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all group">
                          <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">Port Avatar</span>
                        </div>

                        <div className="w-full space-y-2 text-left">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Professional Bio</label>
                          <input
                            placeholder="A concise summary of your digital persona..."
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full h-12 rounded-xl px-4 text-sm outline-none bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:border-primary/50"
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest">Protocol Finalization Ready</p>
                      </div>
                    </div>
                  )}

                  {/* NAV CONTROLS */}
                  <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-200 dark:border-white/5">
                    {step > 1 ? (
                      <button onClick={prevStep} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <ChevronLeft size={14} /> Back
                      </button>
                    ) : <div />}

                    {step < 4 ? (
                      <button
                        disabled={!isStepValid()}
                        onClick={nextStep}
                        className="h-12 px-10 rounded-xl bg-slate-900 dark:bg-primary text-white dark:text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        Next Phase <ChevronRight size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={handleFinish}
                        disabled={isSubmitting}
                        className="h-12 px-10 rounded-xl bg-slate-900 dark:bg-primary text-white dark:text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                      >
                        {isSubmitting ? "Syncing..." : <>Finalize <Check size={14} /></>}
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              <footer className="text-center mt-12">
                <p className="text-[9px] font-black text-slate-500 dark:text-slate-700 uppercase tracking-[0.6em]">
                  Aanya Intelligence &bull; Core Persona Engine
                </p>
              </footer>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );

}
