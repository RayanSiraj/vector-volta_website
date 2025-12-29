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
 * Service: service_9dk7o5d
 * Template: template_75t1uhr
 * Public Key: 6EaILnXguM_D11Pqx
 */
const EMAILJS_SERVICE_ID = 'service_9dk7o5d'; 
const EMAILJS_TEMPLATE_ID = 'template_75t1uhr'; 
const EMAILJS_PUBLIC_KEY = '6EaILnXguM_D11Pqx';   

// --- AI Service ---
const getStrategyInsight = async (businessName: string, goals: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a world-class brand strategist for Vector by Volta. 
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
  <section id={id} className={cn("py-24 px-6 md:px-12", className)}>
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
);

const Reveal = ({ children, delay = 0 }: React.PropsWithChildren<{ delay?: number }>) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
  >
    {children}
  </motion.div>
);

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <button onClick={resetModal} className="absolute top-8 right-8 text-zinc-400 hover:text-zinc-900 z-10 transition-colors">
              <X size={28} />
            </button>

            <div className="p-8 md:p-16">
              {step === 1 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">Unlock Your <br /><span className="text-[#22c55e]">Strategy Blueprint</span></h2>
                    <p className="text-lg text-zinc-500 font-medium leading-relaxed">Tell us about your business, and our AI-strategist will generate a custom preview of your path to Local Legend status.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Business Name</label>
                      <input 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        type="text" 
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-lg font-bold outline-none focus:ring-4 focus:ring-[#22c55e]/10 focus:border-[#22c55e] transition-all" 
                        placeholder="e.g. Atlas Fitness" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Email Address</label>
                      <input 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        type="email" 
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-lg font-bold outline-none focus:ring-4 focus:ring-[#22c55e]/10 focus:border-[#22c55e] transition-all" 
                        placeholder="founder@brand.com" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">What is your primary goal?</label>
                      <textarea 
                        value={formData.goals}
                        onChange={e => setFormData({...formData, goals: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-lg font-bold outline-none focus:ring-4 focus:ring-[#22c55e]/10 focus:border-[#22c55e] transition-all resize-none h-32" 
                        placeholder="e.g. Increase monthly leads by 300%" 
                      />
                    </div>
                  </div>

                  <button 
                    disabled={loading || !formData.name || !formData.goals || !formData.email}
                    onClick={handleGetStrategy}
                    className="w-full bg-[#121212] hover:bg-[#22c55e] text-white py-6 rounded-full font-black text-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                    {loading ? "Analyzing..." : "Generate Strategy Preview"}
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10">
                  <div className="bg-[#121212] p-8 md:p-10 rounded-[2.5rem] text-white space-y-8">
                    <div className="flex items-center gap-3 text-[#22c55e]">
                      <Sparkles size={24} />
                      <span className="text-[10px] font-black uppercase tracking-[0.5em]">Elite Strategy Preview</span>
                    </div>
                    <div className="space-y-4">
                      {insights.map((insight, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/10"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center text-white shrink-0 font-black text-[10px]">{i+1}</div>
                          <p className="font-bold text-base md:text-lg leading-snug">{insight}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8 text-center">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black tracking-tight">Let's refine this together.</h3>
                      <p className="text-zinc-500 font-bold">Pick a time below for your 1:1 Free Strategy Call.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {["Tomorrow at 10:00 AM", "Wednesday at 2:00 PM", "Thursday at 9:00 AM", "Friday at 4:30 PM"].map((time, i) => (
                        <button 
                          key={i}
                          disabled={loading}
                          onClick={() => handleFinalizeBooking(time)}
                          className="p-5 bg-zinc-50 border border-zinc-100 rounded-2xl font-black text-zinc-900 hover:border-[#22c55e] hover:bg-[#22c55e]/5 transition-all text-sm disabled:opacity-50"
                        >
                          {loading && selectedTime === time ? <Loader2 className="animate-spin mx-auto" size={16} /> : time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center space-y-10 py-12">
                  <div className="w-32 h-32 bg-[#22c55e]/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={64} className="text-[#22c55e]" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black tracking-tighter">Strategic Lead <br />Confirmed.</h2>
                    <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-sm mx-auto">We've sent the meeting invite and your custom blueprint to your inbox.</p>
                  </div>
                  <button 
                    onClick={resetModal}
                    className="bg-[#121212] hover:bg-zinc-800 text-white px-16 py-6 rounded-full font-black text-xl transition-all shadow-2xl"
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
      "fixed top-0 w-full z-50 transition-all duration-500 py-6",
      scrolled ? "bg-white/95 backdrop-blur-md border-b border-zinc-100 py-4 shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div 
          className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2 group"
          onClick={() => { setPage('home'); window.scrollTo(0,0); }}
        >
          <div className="w-8 h-8 bg-[#121212] rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
            <Zap size={16} className="text-[#22c55e] fill-[#22c55e]" />
          </div>
          <span className="text-zinc-900">VECTOR</span>
          <span className="text-zinc-400 font-normal">by Volta</span>
        </div>

        <div className="hidden md:flex gap-10 items-center">
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
            className="bg-[#121212] hover:bg-[#22c55e] text-white px-8 py-3 rounded-full font-black text-sm transition-all shadow-lg shadow-zinc-900/10"
          >
            Book Strategy Call
          </button>
        </div>

        <button className="md:hidden text-zinc-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
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
                className="w-full bg-[#22c55e] text-white py-5 rounded-2xl font-black text-lg tracking-tight"
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
  <div>
    <HomeHero onCtaClick={onOpenBooking} onSecondaryClick={() => setPage('services')} />
    
    <Section className="bg-zinc-50 overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="max-w-4xl mx-auto px-4">
            <Reveal>
              <h2 className="text-5xl md:text-8xl font-black text-zinc-900 tracking-tighter mb-6 leading-[0.9]">
                Services Overview
              </h2>
              <p className="text-xl md:text-2xl text-zinc-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                We build the digital foundation your local business needs to dominate the market.
              </p>
              <div className="w-20 h-2 bg-[#22c55e] rounded-full mx-auto mb-16"></div>
            </Reveal>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-12 h-full bg-white overflow-y-auto">
          {[
            { icon: <Globe className="text-[#22c55e]" size={32} />, title: "Website Design & Development", desc: "Fast, modern websites built to convert visitors into customers — not just look good." },
            { icon: <Instagram className="text-[#22c55e]" size={32} />, title: "Social Media Content", desc: "Clean, consistent posts and visuals that make your business look professional everywhere it appears." },
            { icon: <Star className="text-[#22c55e]" size={32} />, title: "Branding & Visuals", desc: "Logos, flyers, and brand systems designed to feel premium and recognizable." },
            { icon: <Zap className="text-[#22c55e]" size={32} />, title: "Automation & Reporting", desc: "Smart systems and performance reports that show what’s working and save you time." }
          ].map((s, i) => (
            <div key={i} className="bg-zinc-50 p-8 rounded-[2.5rem] border border-zinc-100 flex flex-col justify-center hover:bg-zinc-100 transition-colors">
              <div className="mb-6">{s.icon}</div>
              <h3 className="text-2xl font-black mb-3 tracking-tight leading-tight">{s.title}</h3>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </ContainerScroll>
    </Section>

    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <Reveal>
          <div className="relative aspect-square rounded-[4rem] overflow-hidden bg-zinc-100 shadow-2xl border border-zinc-200">
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80" 
              alt="Elite Business" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>
        </Reveal>
        <div className="space-y-12">
          <Reveal>
            <h2 className="text-6xl md:text-8xl font-black text-zinc-900 tracking-tighter mb-8 leading-[0.85]">Why Vector</h2>
            <div className="space-y-12">
              <div className="space-y-4 border-l-8 border-[#22c55e] pl-8 py-2">
                <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Built for businesses that want to stand out</h3>
                <p className="text-xl text-zinc-500 font-medium leading-relaxed">Most local brands blend in. We help you look established, credible, and confident — even if you’re just getting started.</p>
              </div>
              <div className="space-y-4 border-l-8 border-[#22c55e] pl-8 py-2">
                <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Design with intent</h3>
                <p className="text-xl text-zinc-500 font-medium leading-relaxed">Every layout, color, and interaction is chosen for clarity and conversion.</p>
              </div>
              <div className="space-y-4 border-l-8 border-[#22c55e] pl-8 py-2">
                <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">No fluff. No filler.</h3>
                <p className="text-xl text-zinc-500 font-medium leading-relaxed">We focus on what actually moves the needle.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>

    <Section className="bg-[#121212] rounded-t-[5rem] overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22c55e]/10 rounded-full blur-[120px] -mr-60 -mt-60"></div>
      <div className="relative z-10 text-center py-20">
        <Reveal>
          <h2 className="text-6xl md:text-9xl font-black text-white mb-12 tracking-tighter leading-[0.8]">Ready to elevate <br /> your brand?</h2>
          <button 
            onClick={onOpenBooking}
            className="bg-[#22c55e] hover:bg-[#1da84d] text-white px-16 py-8 rounded-full font-black text-2xl shadow-2xl shadow-green-900/40 transition-all flex items-center gap-4 mx-auto group"
          >
            Book a Free Strategy Call <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </Reveal>
      </div>
    </Section>
  </div>
);

const ServicesPage = () => {
  const servicesData = [
    {
      title: "Website Design & Development",
      content: (
        <div className="space-y-8">
          <p className="text-3xl text-zinc-500 font-bold tracking-tight leading-tight">
            We build clean, fast, conversion-focused websites that make a strong first impression and guide visitors to take action.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Custom design tailored to your brand", "Mobile-first layouts", "Clear calls to action", "Optional automations and integrations"].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-zinc-50 p-8 rounded-3xl border border-zinc-100 hover:bg-zinc-100 transition-colors">
                <CheckCircle2 className="text-[#22c55e] shrink-0" size={28} />
                <span className="font-black text-zinc-900 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Social Media Content & Management",
      content: (
        <div className="space-y-8">
          <p className="text-3xl text-zinc-500 font-bold tracking-tight leading-tight">
            Consistent, professional content that makes your business look polished and active.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["High-quality posts and flyers", "Consistent visual style", "Content planned for growth, not noise"].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-zinc-50 p-8 rounded-3xl border border-zinc-100 hover:bg-zinc-100 transition-colors">
                <CheckCircle2 className="text-[#22c55e] shrink-0" size={28} />
                <span className="font-black text-zinc-900 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Branding & Visuals",
      content: (
        <div className="space-y-8">
          <p className="text-3xl text-zinc-500 font-bold tracking-tight leading-tight">
            A strong visual identity that people recognize and remember.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Logos and brand assets", "Flyers and promotional visuals", "Clean, consistent design systems"].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-zinc-50 p-8 rounded-3xl border border-zinc-100 hover:bg-zinc-100 transition-colors">
                <CheckCircle2 className="text-[#22c55e] shrink-0" size={28} />
                <span className="font-black text-zinc-900 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Automation & Reporting",
      content: (
        <div className="space-y-8">
          <p className="text-3xl text-zinc-500 font-bold tracking-tight leading-tight">
            We simplify your workflow and show you what’s working.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Performance reports", "Engagement tracking", "Automation options based on your needs"].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-zinc-50 p-8 rounded-3xl border border-zinc-100 hover:bg-zinc-100 transition-colors">
                <CheckCircle2 className="text-[#22c55e] shrink-0" size={28} />
                <span className="font-black text-zinc-900 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="pt-20">
      <Timeline 
        data={servicesData} 
        headerTitle="Services That Actually Move Your Business Forward"
        headerDescription="Premium digital solutions designed to create lasting authority for local brands. We focus on results, not noise."
      />
    </div>
  );
};

const PricingPage = ({ onOpenBooking }: { onOpenBooking: () => void }) => (
  <div className="pt-32">
    <Section>
      <Reveal>
        <div className="text-center max-w-4xl mx-auto mb-24">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85]">Simple, Transparent Pricing</h1>
          <p className="text-2xl text-zinc-500 font-bold leading-relaxed">High-performance packages built for established brands and rising legends.</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 items-stretch">
        {[
          { 
            name: "Basic Presence", 
            price: "250", 
            features: ["12 posts", "Posts + flyers only", "Clean, professional visuals"], 
            popular: false,
            cta: "Get Started"
          },
          { 
            name: "Growth Package", 
            price: "300", 
            features: ["20 posts", "Posts + flyers", "Performance reports", "Actionable insights"], 
            popular: true,
            cta: "Get Started",
            tag: "Most Popular"
          },
          { 
            name: "Authority Package", 
            price: "400", 
            features: ["40 posts", "Everything in Growth", "Advanced analytics or automation", "Custom content strategy"], 
            popular: false,
            cta: "Get Started"
          }
        ].map((p, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className={cn(
              "p-12 rounded-[4rem] flex flex-col h-full border transition-all duration-500",
              p.popular ? "bg-[#121212] text-white border-zinc-800 shadow-2xl scale-105 z-10" : "bg-white border-zinc-100 hover:shadow-xl"
            )}>
              {p.popular && (
                <div className="bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-[0.5em] px-5 py-2 rounded-full w-fit mb-10">
                  {p.tag}
                </div>
              )}
              <h3 className="text-4xl font-black mb-6 tracking-tighter leading-none">{p.name}</h3>
              <div className="mb-12">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-black opacity-50 uppercase tracking-[0.3em]">Starting at</span>
                  <span className={cn("text-7xl font-black tracking-tighter leading-none", p.popular ? "text-[#22c55e]" : "text-zinc-900")}>${p.price}</span>
                </div>
              </div>
              <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-12"></div>
              <ul className="space-y-6 mb-16 flex-grow">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-4 text-xl font-bold leading-tight">
                    <CheckCircle2 className="text-[#22c55e] shrink-0 mt-1" size={24} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onOpenBooking}
                className={cn(
                "w-full py-7 rounded-full font-black text-xl transition-all shadow-2xl",
                p.popular ? "bg-[#22c55e] text-white hover:bg-[#1da84d] shadow-green-900/20" : "bg-zinc-900 text-white hover:bg-zinc-700 shadow-zinc-900/20"
              )}>
                {p.cta}
              </button>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="space-y-8">
        <Reveal>
          <div className="bg-zinc-50 rounded-[4.5rem] p-12 md:p-20 border border-zinc-100 flex flex-col lg:flex-row justify-between items-center gap-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-[#121212] rounded-3xl flex items-center justify-center shadow-xl">
                  <Globe className="text-[#22c55e]" size={32} />
                </div>
                <h3 className="text-5xl font-black tracking-tighter">Website Services</h3>
              </div>
              <div className="mb-10">
                <p className="text-4xl font-black text-[#22c55e] tracking-tighter">Starting at $300+</p>
                <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.5em] mt-3 italic">+ $20 per month hosting fees</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                {["Fully custom design", "Mobile optimization", "Optional automations", "Pricing based on complexity"].map((f, i) => (
                  <div key={i} className="font-bold flex items-center gap-4 text-zinc-600 text-lg">
                    <Plus className="text-[#22c55e]" size={20} /> {f}
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={onOpenBooking}
              className="bg-[#121212] hover:bg-[#22c55e] text-white px-16 py-7 rounded-full font-black text-2xl transition-all shadow-2xl shadow-zinc-900/20 w-full lg:w-auto"
            >
              Request a Quote
            </button>
          </div>
        </Reveal>

        <Reveal>
          <div className="bg-[#22c55e] rounded-[4.5rem] p-12 md:p-20 text-white text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none"></div>
            <h4 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">Bundle Offer</h4>
            <p className="text-2xl md:text-3xl font-bold mb-12 opacity-95 max-w-2xl mx-auto leading-relaxed">Website + social content packages available at a discounted rate.</p>
            <button 
              onClick={onOpenBooking}
              className="bg-white text-[#22c55e] px-16 py-7 rounded-full font-black text-2xl hover:scale-105 transition-transform shadow-2xl"
            >
              Book a Strategy Call
            </button>
          </div>
        </Reveal>
      </div>
    </Section>
  </div>
);

const AboutPage = () => (
  <div className="pt-32">
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <Reveal>
          <div className="space-y-12">
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8]">About <br /> <span className="text-[#22c55e]">Vector by Volta</span></h1>
            <div className="space-y-10 text-2xl md:text-3xl text-zinc-500 font-medium leading-relaxed">
              <p className="text-zinc-900 font-black text-4xl italic leading-tight border-l-8 border-[#22c55e] pl-10">"Vector by Volta was built for businesses that care about how they show up."</p>
              <div className="space-y-6">
                <p>We believe good design isn’t loud — it’s clear. It’s intentional. And it earns trust.</p>
                <p>We work with local brands that want to look established, credible, and professional across every touchpoint — from their website to their social media.</p>
              </div>
              <p className="text-zinc-900 font-black text-4xl leading-tight">No filler. No shortcuts. Just clean work that speaks for itself.</p>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div className="relative">
            <div className="aspect-[4/5] bg-zinc-100 rounded-[5rem] overflow-hidden shadow-2xl ring-1 ring-zinc-200 border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" 
                alt="Elite Collaboration" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-[#121212] text-white p-12 rounded-[3.5rem] shadow-2xl border border-zinc-800 hidden xl:block max-w-md">
              <span className="text-[#22c55e] text-8xl font-black leading-none block mb-6">"</span>
              <p className="text-3xl font-black leading-tight tracking-tight">Elite brands don't follow trends. They set the standard.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>

    <Section className="bg-zinc-50">
      <Reveal>
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">Our Standard</h2>
          <div className="w-32 h-3 bg-[#22c55e] rounded-full mx-auto"></div>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { title: "Clarity over clutter", icon: <Layout className="text-[#22c55e]" size={48} /> },
          { title: "Quality over volume", icon: <Zap className="text-[#22c55e]" size={48} /> },
          { title: "Results over hype", icon: <BarChart3 className="text-[#22c55e]" size={48} /> }
        ].map((item, idx) => (
          <Reveal key={idx} delay={idx * 0.15}>
            <div className="bg-white p-20 rounded-[5rem] text-center border border-zinc-100 h-full shadow-sm hover:shadow-2xl transition-all group">
              <div className="mb-12 flex justify-center bg-zinc-50 w-28 h-28 rounded-[2.5rem] items-center mx-auto group-hover:scale-110 transition-transform shadow-inner">{item.icon}</div>
              <h4 className="text-3xl font-black mb-4 tracking-tighter leading-tight">{item.title}</h4>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className="text-center mt-32">
          <p className="text-4xl text-zinc-400 font-black uppercase tracking-widest italic leading-tight">If that matters to you, we’ll work well together.</p>
        </div>
      </Reveal>
    </Section>
  </div>
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
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );
            setSubmitted(true);
        } catch (error) {
            console.error("Email Error:", error);
            alert("Failed to send message. Please verify your EmailJS connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32">
            <Section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                    <div className="space-y-16">
                        <Reveal>
                            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-12">Let’s Build Something <br /> <span className="text-[#22c55e]">That Works</span></h1>
                            <p className="text-3xl text-zinc-500 font-bold max-w-xl leading-relaxed">Tell us about your business, and we’ll help you figure out the best next step.</p>
                        </Reveal>
                        <Reveal>
                            <div className="space-y-10 text-5xl font-black tracking-tighter text-zinc-900 italic">
                                <p className="flex items-center gap-10"><div className="w-24 h-3 bg-[#22c55e] rounded-full"></div> No pressure.</p>
                                <p className="flex items-center gap-10"><div className="w-24 h-3 bg-[#22c55e] rounded-full"></div> No sales pitch.</p>
                                <p className="flex items-center gap-10"><div className="w-24 h-3 bg-[#22c55e] rounded-full"></div> Just a clear plan.</p>
                            </div>
                        </Reveal>
                        <Reveal>
                            <div className="pt-12">
                                <button 
                                    onClick={onOpenBooking}
                                    className="bg-[#22c55e] hover:bg-[#1da84d] text-white px-20 py-8 rounded-full font-black text-2xl shadow-2xl shadow-green-900/20 transition-all flex items-center gap-4 group"
                                >
                                    Book a Free Strategy Call <ArrowRight className="group-hover:translate-x-3 transition-transform" />
                                </button>
                            </div>
                        </Reveal>
                    </div>
                    <Reveal>
                        <div className="bg-white p-12 md:p-20 rounded-[5rem] border border-zinc-100 shadow-2xl ring-1 ring-zinc-200">
                            <AnimatePresence mode="wait">
                                {!submitted ? (
                                    <motion.div 
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <h3 className="text-4xl font-black mb-16 tracking-tighter">Send us a message</h3>
                                        <form className="space-y-10" onSubmit={handleSubmit}>
                                            <div className="space-y-5">
                                                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Business Name</label>
                                                <input 
                                                    required
                                                    value={formData.name}
                                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                                    type="text" 
                                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-7 text-xl font-bold outline-none focus:ring-4 focus:ring-[#22c55e]/10 focus:border-[#22c55e] transition-all" 
                                                    placeholder="Legendary Local Brand" 
                                                />
                                            </div>
                                            <div className="space-y-5">
                                                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Email Address</label>
                                                <input 
                                                    required
                                                    value={formData.email}
                                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                                    type="email" 
                                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-7 text-xl font-bold outline-none focus:ring-4 focus:ring-[#22c55e]/10 focus:border-[#22c55e] transition-all" 
                                                    placeholder="founder@legend.com" 
                                                />
                                            </div>
                                            <div className="space-y-5">
                                                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">What are you looking for?</label>
                                                <textarea 
                                                    required
                                                    value={formData.message}
                                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-7 text-xl font-bold outline-none focus:ring-4 focus:ring-[#22c55e]/10 focus:border-[#22c55e] transition-all h-40 resize-none" 
                                                    placeholder="Tell us about your goals..."
                                                ></textarea>
                                            </div>
                                            <button 
                                                disabled={loading}
                                                className="w-full bg-[#121212] hover:bg-[#22c55e] text-white py-8 rounded-full font-black text-2xl transition-all shadow-2xl shadow-zinc-900/20 flex items-center justify-center gap-4"
                                            >
                                                {loading ? <Loader2 className="animate-spin" /> : <Send size={24} />}
                                                {loading ? "Sending..." : "Submit Request"}
                                            </button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12 space-y-8"
                                    >
                                        <div className="w-24 h-24 bg-[#22c55e]/10 rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle2 size={48} className="text-[#22c55e]" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-4xl font-black tracking-tighter">Message Sent.</h3>
                                            <p className="text-xl text-zinc-500 font-medium">We've received your inquiry and will be in touch within 24 hours.</p>
                                        </div>
                                        <button 
                                            onClick={() => setSubmitted(false)}
                                            className="text-[#22c55e] font-black uppercase tracking-widest text-sm hover:underline"
                                        >
                                            Send another message
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Reveal>
                </div>
            </Section>
        </div>
    );
};

const Footer = ({ setPage }: { setPage: (p: string) => void }) => (
  <footer className="bg-white border-t border-zinc-100 py-40 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
      <div className="col-span-1 md:col-span-2">
        <div 
          className="text-5xl font-black tracking-tighter cursor-pointer flex items-center gap-4 mb-12"
          onClick={() => { setPage('home'); window.scrollTo(0,0); }}
        >
          <div className="w-14 h-14 bg-[#121212] rounded-2xl flex items-center justify-center">
            <Zap size={32} className="text-[#22c55e] fill-[#22c55e]" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-zinc-900">VECTOR</span>
            <span className="text-zinc-400 font-bold text-base tracking-[0.3em] mt-2">BY VOLTA</span>
          </div>
        </div>
        <p className="text-2xl text-zinc-500 font-bold max-w-sm leading-relaxed">Built for businesses that care about how they show up.</p>
      </div>
      <div>
        <h4 className="font-black uppercase tracking-[0.4em] text-[10px] mb-12 text-zinc-400">Navigation</h4>
        <ul className="space-y-6 font-black text-2xl tracking-tighter">
          {['home', 'services', 'pricing', 'about', 'contact'].map(p => (
            <li key={p}><button onClick={() => { setPage(p); window.scrollTo(0,0); }} className="hover:text-[#22c55e] transition-colors capitalize">{p}</button></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-black uppercase tracking-[0.4em] text-[10px] mb-12 text-zinc-400">Connect</h4>
        <ul className="space-y-6 font-black text-2xl tracking-tighter">
          <li><a href="#" className="hover:text-[#22c55e] transition-colors">Instagram</a></li>
          <li><a href="#" className="hover:text-[#22c55e] transition-colors">Email Us</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-40 pt-16 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-10 text-zinc-400 font-black uppercase tracking-[0.5em] text-[10px]">
      <p>© 2024 Vector by Volta</p>
      <div className="flex gap-16">
        <p>Local Legend Protocol</p>
        <p>Privacy / Terms</p>
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
    <div className="min-h-screen font-sans selection:bg-[#22c55e] selection:text-white bg-white">
      <Navbar setPage={setPage} onOpenBooking={() => setIsBookingOpen(true)} />
      <main>
        {renderPage()}
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
