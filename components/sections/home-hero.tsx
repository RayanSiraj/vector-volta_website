"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "../ui/aurora-background";
import { ArrowRight } from "lucide-react";

export function HomeHero({ onCtaClick, onSecondaryClick }: { onCtaClick: () => void, onSecondaryClick: () => void }) {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-8 items-center justify-center px-4 max-w-5xl mx-auto text-center"
      >
        <h1 className="text-5xl md:text-8xl font-black text-zinc-900 tracking-tight leading-[1.1]">
          Turning Businesses into <br className="hidden md:block" />
          <span className="text-[#22c55e]">Local Legends</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-500 max-w-3xl font-medium leading-relaxed">
          We design high-performance websites, content, and systems that help local brands look elite and convert customers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <button 
            onClick={onCtaClick}
            className="bg-[#22c55e] hover:bg-[#1da84d] text-white px-8 py-5 rounded-full font-bold text-lg shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
          >
            Book a Free Strategy Call <ArrowRight size={20} />
          </button>
          <button 
            onClick={onSecondaryClick}
            className="bg-white border-2 border-zinc-200 hover:border-[#22c55e] hover:text-[#22c55e] text-zinc-600 px-8 py-5 rounded-full font-bold text-lg transition-all"
          >
            View Our Services
          </button>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
