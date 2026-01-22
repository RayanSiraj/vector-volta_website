import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ArrowRight, 
  CheckCircle2, 
  Menu, 
  X, 
  Layout, 
  Zap, 
  BarChart3, 
  Globe, 
  Star, 
  Plus, 
  Sparkles, 
  Loader2, 
  Instagram, 
  Mail, 
  Send 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import emailjs from '@emailjs/browser';
import { HomeHero } from './components/sections/home-hero';
import { ContainerScroll } from './components/ui/container-scroll-animation';
import { Timeline } from './components/ui/timeline';
import { cn } from './lib/utils';

/**
 * LIVE PRODUCTION CREDENTIALS
 */
const EMAILJS_SERVICE_ID = 'service_9dk7o5d'; 
const EMAILJS_TEMPLATE_ID = 'template_75t1uhr'; 
const EMAILJS_PUBLIC_KEY = '6EaILnXgu_D11Pqx';   

// --- AI Service ---
const getStrategyInsight = async (businessName: string, goals: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a world-class brand strategist for Vector Studios. 
      Analyze this business: "${businessName}" with these goals: "${goals}".
      Provide 3 high-impact "Elite Strategic Moves" (concise, professional, and confident). 
      Format as a JSON array of strings. Do not include any other text.`,
      config: { 
        responseMimeType: "application/json",
        temperature: 0.7 
      }
    });
    
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("AI Insight Error:", e);
    return ["Optimize high-conversion landing pages", "Automate lead nurturing systems", "Scale premium visual content"];
  }
};

// --- Global UI Components ---

const Section = ({ children, className, id }: React.PropsWithChildren<{ className?: string, id?: string }>) => (
  <section id={id} className={cn("py-16 md:py-24 px-5 md:px-12", className)}>
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
);

const Reveal = ({ children, delay = 0, direction = "up" }: any) => {
  const variants = {
    up: { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -30 }, whileInView: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 20 }, whileInView: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 } },
    scale: { initial: { opacity: 0, scale: 0.95 }, whileInView: { opacity: 1, scale: 1 } },
  };

  const selected = (variants as any)[direction] || variants.up;

  return (
    <motion.div
      initial={selected.initial}
      whileInView={selected.whileInView}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

const StaggerContainer = ({ children, delay = 0 }: any) => (
  <motion.div
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      initial: {},
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay,
        }
      }
    }}
  >
    {children}
  </motion.div>
);

const StaggerItem = ({ children, direction = "up" }: any) => {
  const variants = {
    up: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
    scale: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
  };
  const selected = (variants as any)[direction] || variants.up;

  return (
    <motion.div
      variants={selected}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const BookingModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', goals: '', email: '' });
  const [insights, setInsights] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');

  const handleGetStrategy = async () => {
    if (!formData.name || !formData.goals) return;
    setLoading(true);
    const result = await getStrategyInsight(formData.name, formData.goals);
    setInsights(result);
    setLoading(false);
    setStep(2);
  };

  const handleFinalizeBooking = async (time: string) => {
    setSelectedTime(time);
    setLoading(true);
    
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: `STRATEGY CALL BOOKED:
-------------------------
Preferred Time: ${time}
Business Name: ${formData.name}
Strategic Goals: ${formData.goals}
AI Insights Generated: ${insights.join(' | ')}`
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      setStep(3);
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Failed to send booking. Please ensure your EmailJS account is connected to a mail service.");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setFormData({ name: '', goals: '', email: '' });
    setInsights([]);
    setSelectedTime('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={resetModal}
            className="absolute inset-0 bg-[#121212]/95 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button onClick={resetModal} className="absolute top-4 right-4 sm:top-8 sm:right-8 text-zinc-400 hover:text-zinc-900 z-10 transition-colors">
              <X size={24} className="sm:w-7 sm:h-7" />
            </button>

            <div className="p-6 sm:p-12 md:p-16">
              {step === 1 && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="space-y-2 sm:space-y-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">Unlock Your <br /><span className="text-[#22c55e]">Strategy Blueprint</span></h2>
                    <p className="text-base sm:text-lg text-zinc-500 font-medium leading-relaxed">Tell us about your business, and our AI-strategist will generate a custom preview of your path to Local Legend status.</p>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Business Name</label>
                      <input 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        type="text" 
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-base sm:text-lg font-bold outline-none focus:ring-4 focus:ring-[#22c55e]/10 transition-all" 
                        placeholder="e.g. Atlas Fitness" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Email Address</label>
                      <input 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        type="email" 
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-base sm:text-lg font-bold outline-none focus:ring-4 focus:ring-[#22c55e]/10 transition-all" 
                        placeholder="founder@brand.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Primary Goal</label>
                      <textarea 
                        value={formData.goals}
                        onChange={e => setFormData({...formData, goals: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-base sm:text-lg font-bold outline-none focus:ring-4 focus:ring-[#22c55e]/10 transition-all resize-none h-24 sm:h-32" 
                        placeholder="e.g. Increase monthly leads by 300%" 
                      />
                    </div>
                  </div>

                  <button 
                    disabled={loading || !formData.name || !formData.goals || !formData.email}
                    onClick={handleGetStrategy}
                    className="w-full bg-[#121212] hover:bg-[#22c55e] text-white py-5 sm:py-6 rounded-full font-black text-lg sm:text-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                    {loading ? "Analyzing..." : "Generate Preview"}
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 sm:space-y-10">
                  <div className="bg-[#121212] p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] text-white space-y-6 sm:space-y-8">
                    <div className="flex items-center gap-3 text-[#22c55e]">
                      <Sparkles size={20} />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em]">Elite Strategy Preview</span>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {insights.map((insight, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10"
                        >
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#22c55e] flex items-center justify-center text-white shrink-0 font-black text-[9px] sm:text-[10px]">{i+1}</div>
                          <p className="font-bold text-sm sm:text-base md:text-lg leading-snug">{insight}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 sm:space-y-8 text-center">
                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Let's refine this together.</h3>
                      <p className="text-sm sm:text-base text-zinc-500 font-bold">Pick a time for your 1:1 Free Strategy Call.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {["Tomorrow at 10:00 AM", "Wednesday at 2:00 PM", "Thursday at 9:00 AM", "Friday at 4:30 PM"].map((time, i) => (
                        <button 
                          key={i}
                          disabled={loading}
                          onClick={() => handleFinalizeBooking(time)}
                          className="p-4 sm:p-5 bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-2xl font-black text-zinc-900 hover:border-[#22c55e] hover:bg-[#22c55e]/5 transition-all text-xs sm:text-sm disabled:opacity-50"
                        >
                          {loading && selectedTime === time ? <Loader2 className="animate-spin mx-auto" size={16} /> : time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center space-y-8 sm:space-y-10 py-8 sm:py-12">
                  <div className="w-20 h-20 sm:w-32 sm:h-32 bg-[#22c55e]/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={40} className="sm:w-16 sm:h-16 text-[#22c55e]" />
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">Confirmed.</h2>
                    <p className="text-lg sm:text-xl text-zinc-500 font-medium leading-relaxed max-w-sm mx-auto">We've sent the meeting invite and your custom blueprint to your inbox.</p>
                  </div>
                  <button 
                    onClick={resetModal}
                    className="bg-[#121212] hover:bg-zinc-800 text-white px-12 sm:px-16 py-4 sm:py-6 rounded-full font-black text-lg sm:text-xl transition-all shadow-2xl"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ setPage, onOpenBooking }: { setPage: (p: string) => void, onOpenBooking: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500 py-4 sm:py-6",
      scrolled ? "bg-white/95 backdrop-blur-md border-b border-zinc-100 py-3 sm:py-4 shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 flex justify-between items-center">
        <div 
          className="text-xl sm:text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2 group"
          onClick={() => { setPage('home'); window.scrollTo(0,0); }}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#121212] rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
            <Zap size={14} className="sm:w-4 sm:h-4 text-[#22c55e] fill-[#22c55e]" />
          </div>
          <span className="text-zinc-900">VECTOR</span>
          <span className="text-zinc-400 font-normal hidden xs:inline">STUDIOS</span>
        </div>

        <div className="hidden md:flex gap-8 lg:gap-10 items-center">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => { setPage(link.id); window.scrollTo(0,0); }}
              className="text-[10px] font-black text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-[0.3em]"
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={onOpenBooking}
            className="bg-[#121212] hover:bg-[#22c55e] text-white px-6 lg:px-8 py-3 rounded-full font-black text-xs lg:text-sm transition-all shadow-lg shadow-zinc-900/10"
          >
            Book Now
          </button>
        </div>

        <button className="md:hidden text-zinc-900 p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-zinc-100 overflow-hidden shadow-xl"
          >
            <div className="p-8 flex flex-col gap-6">
              {links.map(link => (
                <button
                  key={link.id}
                  onClick={() => { setPage(link.id); setIsOpen(false); window.scrollTo(0,0); }}
                  className="text-2xl font-black text-zinc-900 text-left tracking-tighter"
                >
                  {link.name}
                </button>
              ))}
              <button 
                onClick={() => { onOpenBooking(); setIsOpen(false); }}
                className="w-full bg-[#22c55e] text-white py-4 rounded-xl font-black text-lg tracking-tight"
              >
                Book Free Strategy Call
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Page Views ---

const HomePage = ({ setPage, onOpenBooking }: { setPage: (p: string) => void, onOpenBooking: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
    <HomeHero onCtaClick={onOpenBooking} onSecondaryClick={() => setPage('services')} />
    
    <Section className="bg-zinc-50 overflow-hidden px-0 sm:px-12">
      <ContainerScroll
        titleComponent={
          <div className="max-w-4xl mx-auto px-5">
            <Reveal>
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-zinc-900 tracking-tighter mb-4 sm:mb-6 leading-[0.9]">
                Services Overview
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-zinc-500 font-medium mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
                We build the digital foundation your local business needs to dominate the market.
              </p>
              <div className="w-16 sm:w-20 h-1.5 sm:h-2 bg-[#22c55e] rounded-full mx-auto mb-10 sm:mb-16"></div>
            </Reveal>
          </div>
        }
      >
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-12 h-full bg-white overflow-y-auto">
            {[
              { icon: <Globe className="text-[#22c55e]" size={28} />, title: "Website Design", desc: "Fast, modern websites built to convert visitors into customers." },
              { icon: <Instagram className="text-[#22c55e]" size={28} />, title: "Social Media", desc: "Clean, consistent posts and visuals that build credibility." },
              { icon: <Star className="text-[#22c55e]" size={28} />, title: "Branding", desc: "Logos and systems designed to feel premium and recognizable." },
              { icon: <Zap className="text-[#22c55e]" size={28} />, title: "Automation", desc: "Smart systems and reporting that show what’s working." }
            ].map((s, i) => (
              <StaggerItem key={i}>
                <div className="bg-zinc-50 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-zinc-100 flex flex-col justify-center hover:bg-zinc-100 transition-colors h-full">
                  <div className="mb-4 sm:mb-6">{s.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-black mb-2 tracking-tight leading-tight">{s.title}</h3>
                  <p className="text-zinc-500 text-sm sm:text-lg font-medium leading-relaxed">{s.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </ContainerScroll>
    </Section>

    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
        <Reveal direction="left">
          <div className="relative aspect-square rounded-[2rem] sm:rounded-[4rem] overflow-hidden bg-zinc-100 shadow-xl sm:shadow-2xl border border-zinc-200 max-w-lg mx-auto lg:max-w-none">
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80" 
              alt="Elite Business" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>
        </Reveal>
        <div className="space-y-8 sm:space-y-12">
          <Reveal direction="right">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-zinc-900 tracking-tighter mb-6 sm:mb-8 leading-[0.85]">Why Vector</h2>
            <div className="space-y-8 sm:space-y-12">
              <div className="space-y-2 sm:space-y-4 border-l-4 sm:border-l-8 border-[#22c55e] pl-5 sm:pl-8 py-1 sm:py-2">
                <h3 className="text-lg sm:text-2xl font-black text-zinc-900 uppercase tracking-tight">Built to stand out</h3>
                <p className="text-base sm:text-xl text-zinc-500 font-medium leading-relaxed">Most local brands blend in. We help you look established and confident from day one.</p>
              </div>
              <div className="space-y-2 sm:space-y-4 border-l-4 sm:border-l-8 border-[#22c55e] pl-5 sm:pl-8 py-1 sm:py-2">
                <h3 className="text-lg sm:text-2xl font-black text-zinc-900 uppercase tracking-tight">Design with intent</h3>
                <p className="text-base sm:text-xl text-zinc-500 font-medium leading-relaxed">Every layout is chosen for clarity and conversion — not just aesthetics.</p>
              </div>
              <div className="space-y-2 sm:space-y-4 border-l-4 sm:border-l-8 border-[#22c55e] pl-5 sm:pl-8 py-1 sm:py-2">
                <h3 className="text-lg sm:text-2xl font-black text-zinc-900 uppercase tracking-tight">No fluff</h3>
                <p className="text-base sm:text-xl text-zinc-500 font-medium leading-relaxed">We focus on what actually moves the needle for your business.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>

    <Section className="bg-[#121212] rounded-t-[3rem] sm:rounded-t-[5rem] overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[#22c55e]/10 rounded-full blur-[80px] sm:blur-[120px] -mr-40 -mt-40 sm:-mr-60 sm:-mt-60"></div>
      <div className="relative z-10 text-center py-12 sm:py-20">
        <Reveal direction="scale">
          <h2 className="text-4xl sm:text-6xl md:text-9xl font-black text-white mb-8 sm:mb-12 tracking-tighter leading-[0.8]">Ready to elevate <br /> your brand?</h2>
          <button 
            onClick={onOpenBooking}
            className="bg-[#22c55e] hover:bg-[#1da84d] text-white px-8 sm:px-16 py-5 sm:py-8 rounded-full font-black text-lg sm:text-2xl shadow-xl sm:shadow-2xl shadow-green-900/40 transition-all flex items-center gap-3 sm:gap-4 mx-auto group"
          >
            Start Strategy Call <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </Reveal>
      </div>
    </Section>
  </motion.div>
);

const ServicesPage = () => {
  const servicesData = [
    {
      title: "Web Development",
      content: (
        <div className="space-y-6 sm:space-y-8">
          <p className="text-xl sm:text-3xl text-zinc-500 font-bold tracking-tight leading-tight">
            Clean, fast websites that guide visitors to take action.
          </p>
          <StaggerContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {["Custom brand design", "Mobile-first layout", "High conversion focus"].map((item, i) => (
                <StaggerItem key={i}>
                  <div className="flex items-center gap-3 sm:gap-4 bg-zinc-50 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-zinc-100">
                    <CheckCircle2 className="text-[#22c55e] shrink-0" size={24} />
                    <span className="font-black text-zinc-900 text-base sm:text-lg">{item}</span>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      ),
    },
    {
      title: "Social Content",
      content: (
        <div className="space-y-6 sm:space-y-8">
          <p className="text-xl sm:text-3xl text-zinc-500 font-bold tracking-tight leading-tight">
            Consistent content that makes you look polished.
          </p>
          <StaggerContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {["High-quality posts", "Unified style", "Planned for growth"].map((item, i) => (
                <StaggerItem key={i}>
                  <div className="flex items-center gap-3 sm:gap-4 bg-zinc-50 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-zinc-100">
                    <CheckCircle2 className="text-[#22c55e] shrink-0" size={24} />
                    <span className="font-black text-zinc-900 text-base sm:text-lg">{item}</span>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      ),
    },
    {
      title: "Brand Systems",
      content: (
        <div className="space-y-6 sm:space-y-8">
          <p className="text-xl sm:text-3xl text-zinc-500 font-bold tracking-tight leading-tight">
            A visual identity that people remember.
          </p>
          <StaggerContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {["Memorable logos", "Flyers & assets", "Design guides"].map((item, i) => (
                <StaggerItem key={i}>
                  <div className="flex items-center gap-3 sm:gap-4 bg-zinc-50 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-zinc-100">
                    <CheckCircle2 className="text-[#22c55e] shrink-0" size={24} />
                    <span className="font-black text-zinc-900 text-base sm:text-lg">{item}</span>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="pt-16 sm:pt-20">
      <Timeline 
        data={servicesData} 
        headerTitle="Solutions That Scale"
        headerDescription="Premium digital solutions designed to create lasting authority for local brands."
      />
    </motion.div>
  );
};

const PricingPage = ({ onOpenBooking }: { onOpenBooking: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="pt-24 sm:pt-32">
    <Section>
      <Reveal direction="scale">
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-24">
          <h1 className="text-4xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-4 sm:mb-8 leading-[0.85]">Simple Pricing</h1>
          <p className="text-lg sm:text-2xl text-zinc-500 font-bold leading-relaxed">Built for established brands and rising legends.</p>
        </div>
      </Reveal>

      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20 sm:mb-32 items-stretch">
          {[
            { 
              name: "Basic", 
              price: "400", 
              features: ["12 posts", "Visuals only", "Elite polish"], 
              popular: false,
              cta: "Start Basic"
            },
            { 
              name: "Growth", 
              price: "650", 
              features: ["20 posts", "Performance reports", "Actionable insights"], 
              popular: true,
              cta: "Get Growth",
              tag: "Best Value"
            },
            { 
              name: "Authority", 
              price: "1100", 
              features: ["40 posts", "Advanced analytics", "Strategy lead"], 
              popular: false,
              cta: "Scale Now"
            }
          ].map((p, i) => (
            <StaggerItem key={i} direction="scale">
              <div className={cn(
                "p-8 sm:p-12 rounded-[2rem] sm:rounded-[4rem] flex flex-col h-full border transition-all duration-500",
                p.popular ? "bg-[#121212] text-white border-zinc-800 shadow-xl sm:scale-105 z-10" : "bg-white border-zinc-100"
              )}>
                {p.popular && (
                  <div className="bg-[#22c55e] text-white text-[9px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full w-fit mb-8 sm:mb-10">
                    {p.tag}
                  </div>
                )}
                <h3 className="text-2xl sm:text-4xl font-black mb-4 sm:mb-6 tracking-tighter leading-none">{p.name}</h3>
                <div className="mb-8 sm:mb-12">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[9px] font-black opacity-50 uppercase tracking-[0.2em]">From</span>
                    <span className={cn("text-5xl sm:text-7xl font-black tracking-tighter leading-none", p.popular ? "text-[#22c55e]" : "text-zinc-900")}>${p.price}</span>
                  </div>
                </div>
                <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 mb-8 sm:mb-12"></div>
                <ul className="space-y-4 sm:space-y-6 mb-10 sm:mb-16 flex-grow">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 sm:gap-4 text-base sm:text-xl font-bold leading-tight">
                      <CheckCircle2 className="text-[#22c55e] shrink-0 mt-0.5 sm:mt-1" size={18} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={onOpenBooking}
                  className={cn(
                  "w-full py-5 sm:py-7 rounded-full font-black text-lg sm:text-xl transition-all shadow-xl",
                  p.popular ? "bg-[#22c55e] text-white hover:bg-[#1da84d]" : "bg-zinc-900 text-white hover:bg-zinc-700"
                )}>
                  {p.cta}
                </button>
              </div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      <div className="space-y-6 sm:space-y-8">
        <Reveal direction="up">
          <div className="bg-zinc-50 rounded-[2rem] sm:rounded-[4.5rem] p-8 sm:p-20 border border-zinc-100 flex flex-col lg:flex-row justify-between items-center gap-10 sm:gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#121212] rounded-2xl flex items-center justify-center shadow-lg">
                  <Globe className="text-[#22c55e]" size={24} />
                </div>
                <h3 className="text-3xl sm:text-5xl font-black tracking-tighter">Websites</h3>
              </div>
              <div className="mb-6 sm:mb-10">
                <p className="text-3xl sm:text-4xl font-black text-[#22c55e] tracking-tighter">From $500+</p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mt-2 italic">+ $40 hosting fee</p>
                <p className="text-xs text-zinc-500 font-bold mt-4">Pricing scales based on cross-platform requirements and automation complexity.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {["Custom build", "Mobile & Cross-platform", "Advanced automations"].map((f, i) => (
                  <div key={i} className="font-bold flex items-center justify-center lg:justify-start gap-3 text-zinc-600 text-sm sm:text-lg">
                    <Plus className="text-[#22c55e]" size={16} /> {f}
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={onOpenBooking}
              className="bg-[#121212] hover:bg-[#22c55e] text-white px-10 sm:px-16 py-5 sm:py-7 rounded-full font-black text-lg sm:text-2xl transition-all shadow-xl w-full lg:w-auto"
            >
              Get Quote
            </button>
          </div>
        </Reveal>
      </div>
    </Section>
  </motion.div>
);

const AboutPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="pt-24 sm:pt-32">
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
        <Reveal direction="left">
          <div className="space-y-8 sm:space-y-12 text-center lg:text-left">
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.8]">About <br /> <span className="text-[#22c55e]">Vector</span></h1>
            <div className="space-y-6 sm:space-y-10 text-lg sm:text-2xl md:text-3xl text-zinc-500 font-medium leading-relaxed">
              <p className="text-zinc-900 font-black text-2xl sm:text-4xl italic leading-tight border-l-4 sm:border-l-8 border-[#22c55e] pl-5 sm:pl-10 text-left">"Built for businesses that care about how they show up."</p>
              <div className="space-y-4 sm:space-y-6">
                <p>We believe good design isn’t loud — it’s clear. It earns trust through intentionality.</p>
                <p>We work with brands that want to look professional across every touchpoint.</p>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal direction="right">
          <div className="relative max-w-md mx-auto lg:max-w-none">
            <div className="aspect-[4/5] bg-zinc-100 rounded-[2rem] sm:rounded-[5rem] overflow-hidden shadow-xl ring-1 ring-zinc-200 border-4 sm:border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" 
                alt="Elite Collaboration" 
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>

    <Section className="bg-zinc-50">
      <Reveal direction="up">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter">The Standard</h2>
          <div className="w-20 sm:w-32 h-2 sm:h-3 bg-[#22c55e] rounded-full mx-auto"></div>
        </div>
      </Reveal>
      <StaggerContainer>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12">
          {[
            { title: "Clarity over clutter", icon: <Layout className="text-[#22c55e]" size={32} /> },
            { title: "Quality over volume", icon: <Zap className="text-[#22c55e]" size={32} /> },
            { title: "Results over hype", icon: <BarChart3 className="text-[#22c55e]" size={32} /> }
          ].map((item, idx) => (
            <StaggerItem key={idx}>
              <div className="bg-white p-10 sm:p-20 rounded-[2rem] sm:rounded-[5rem] text-center border border-zinc-100 h-full shadow-sm">
                <div className="mb-8 flex justify-center bg-zinc-50 w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-[2.5rem] items-center mx-auto">{item.icon}</div>
                <h4 className="text-xl sm:text-3xl font-black tracking-tighter leading-tight">{item.title}</h4>
              </div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </Section>
  </motion.div>
);

const ContactPage = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
        };
        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
            setSubmitted(true);
        } catch (error) {
            console.error("Email Error:", error);
            alert("Failed to send message.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="pt-24 sm:pt-32">
            <Section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-24 items-start">
                    <div className="space-y-12 sm:space-y-16 text-center lg:text-left">
                        <Reveal direction="left">
                            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-8 sm:mb-12">Let’s Start <br /> <span className="text-[#22c55e]">Something</span></h1>
                            <p className="text-xl sm:text-3xl text-zinc-500 font-bold max-w-xl mx-auto lg:mx-0 leading-relaxed">Tell us about your business, and we’ll help you find the best next step.</p>
                        </Reveal>
                        <StaggerContainer>
                          <div className="space-y-6 sm:space-y-10 text-3xl sm:text-5xl font-black tracking-tighter text-zinc-900 italic text-left max-w-sm mx-auto lg:mx-0">
                              <StaggerItem><p className="flex items-center gap-6 sm:gap-10"><div className="w-12 sm:w-24 h-2 sm:h-3 bg-[#22c55e] rounded-full"></div> No pressure.</p></StaggerItem>
                              <StaggerItem><p className="flex items-center gap-6 sm:gap-10"><div className="w-12 sm:w-24 h-2 sm:h-3 bg-[#22c55e] rounded-full"></div> No hype.</p></StaggerItem>
                              <StaggerItem><p className="flex items-center gap-6 sm:gap-10"><div className="w-12 sm:w-24 h-2 sm:h-3 bg-[#22c55e] rounded-full"></div> A clear plan.</p></StaggerItem>
                          </div>
                        </StaggerContainer>
                        <Reveal direction="up" delay={0.4}>
                            <div className="pt-6 sm:pt-12">
                                <button 
                                    onClick={onOpenBooking}
                                    className="bg-[#22c55e] hover:bg-[#1da84d] text-white px-10 sm:px-20 py-5 sm:py-8 rounded-full font-black text-lg sm:text-2xl shadow-xl transition-all flex items-center gap-3 sm:gap-4 mx-auto lg:mx-0 group"
                                >
                                    Book Free Strategy Call <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </Reveal>
                    </div>
                    <Reveal direction="right">
                        <div className="bg-white p-8 sm:p-20 rounded-[2rem] sm:rounded-[5rem] border border-zinc-100 shadow-2xl ring-1 ring-zinc-200 max-w-xl mx-auto lg:max-w-none">
                            <AnimatePresence mode="wait">
                                {!submitted ? (
                                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <h3 className="text-2xl sm:text-4xl font-black mb-10 sm:mb-16 tracking-tighter">Send a message</h3>
                                        <form className="space-y-6 sm:space-y-10" onSubmit={handleSubmit}>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Name</label>
                                                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-5 text-lg font-bold outline-none focus:ring-4 focus:ring-[#22c55e]/10 transition-all" placeholder="Atlas Fitness" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Email</label>
                                                <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-5 text-lg font-bold outline-none focus:ring-4 focus:ring-[#22c55e]/10 transition-all" placeholder="founder@brand.com" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Message</label>
                                                <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-5 text-lg font-bold outline-none focus:ring-4 focus:ring-[#22c55e]/10 transition-all h-32 resize-none" placeholder="How can we help?" />
                                            </div>
                                            <button disabled={loading} className="w-full bg-[#121212] hover:bg-[#22c55e] text-white py-6 rounded-full font-black text-xl transition-all shadow-lg flex items-center justify-center gap-3">
                                                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                                {loading ? "Sending..." : "Send Request"}
                                            </button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-6">
                                        <div className="w-20 h-20 bg-[#22c55e]/10 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 size={40} className="text-[#22c55e]" /></div>
                                        <div className="space-y-2"><h3 className="text-3xl font-black tracking-tighter">Sent.</h3><p className="text-zinc-500 font-medium">We'll respond within 24 hours.</p></div>
                                        <button onClick={() => setSubmitted(false)} className="text-[#22c55e] font-black text-xs uppercase tracking-widest hover:underline">Send another</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Reveal>
                </div>
            </Section>
        </motion.div>
    );
};

const Footer = ({ setPage }: { setPage: (p: string) => void }) => (
  <footer className="bg-white border-t border-zinc-100 py-20 sm:py-40 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 sm:gap-24">
      <div className="col-span-1 sm:col-span-2">
        <Reveal direction="left">
          <div className="text-3xl sm:text-5xl font-black tracking-tighter cursor-pointer flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12" onClick={() => { setPage('home'); window.scrollTo(0,0); }}>
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#121212] rounded-xl flex items-center justify-center"><Zap size={24} className="sm:w-8 sm:h-8 text-[#22c55e] fill-[#22c55e]" /></div>
            <div className="flex flex-col leading-none"><span className="text-zinc-900">VECTOR</span><span className="text-zinc-400 font-bold text-xs sm:text-base tracking-[0.3em] mt-1 sm:mt-2 uppercase">Studios</span></div>
          </div>
          <p className="text-lg sm:text-2xl text-zinc-500 font-bold max-w-xs leading-relaxed">Built for businesses that care about how they show up.</p>
        </Reveal>
      </div>
      <div>
        <h4 className="font-black uppercase tracking-[0.3em] text-[9px] mb-8 text-zinc-400">Navigate</h4>
        <ul className="space-y-4 font-black text-xl sm:text-2xl tracking-tighter">
          {['home', 'services', 'pricing', 'about', 'contact'].map(p => (
            <li key={p}><button onClick={() => { setPage(p); window.scrollTo(0,0); }} className="hover:text-[#22c55e] transition-colors capitalize">{p}</button></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-black uppercase tracking-[0.3em] text-[9px] mb-8 text-zinc-400">Connect</h4>
        <ul className="space-y-4 font-black text-xl sm:text-2xl tracking-tighter">
          <li><a href="https://www.instagram.com/vectr_studio/" target="_blank" rel="noopener noreferrer" className="hover:text-[#22c55e] transition-colors">Instagram</a></li>
          <li><a href="#" className="hover:text-[#22c55e] transition-colors">Email</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 sm:mt-40 pt-10 sm:pt-16 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-6 text-zinc-400 font-black uppercase tracking-[0.4em] text-[9px]">
      <p>© 2024 Vector Studios</p>
      <div className="flex gap-8">
        <p>Protocol</p>
        <p>Privacy</p>
      </div>
    </div>
  </footer>
);

// --- App Shell ---

const App = () => {
  const [page, setPage] = useState('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const renderPage = () => {
    switch(page) {
      case 'home': return <HomePage setPage={setPage} onOpenBooking={() => setIsBookingOpen(true)} />;
      case 'services': return <ServicesPage />;
      case 'pricing': return <PricingPage onOpenBooking={() => setIsBookingOpen(true)} />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage onOpenBooking={() => setIsBookingOpen(true)} />;
      default: return <HomePage setPage={setPage} onOpenBooking={() => setIsBookingOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#22c55e] selection:text-white bg-white overflow-x-hidden">
      <Navbar setPage={setPage} onOpenBooking={() => setIsBookingOpen(true)} />
      <main>
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>
      <Footer setPage={setPage} />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
