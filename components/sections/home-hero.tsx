"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "../ui/aurora-background";
import { ArrowRight } from "lucide-react";

export function HomeHero({ onCtaClick, onSecondaryClick }: { onCtaClick: () => void, onSecondaryClick: () => void }) {
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <AuroraBackground>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative flex flex-col gap-6 sm:gap-8 items-center justify-center px-5 max-w-5xl mx-auto text-center"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl font-black text-zinc-900 tracking-tight leading-[1.05] sm:leading-[1.1]"
        >
          Turning <br className="hidden xs:block" />
          Businesses into <br className="hidden xs:block" />
          <span className="text-[#22c55e]">Local Legends</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-zinc-500 max-w-3xl font-medium leading-relaxed"
        >
          We design high-performance websites and visual systems that help local brands look elite and convert customers.
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-4"
        >
          <button 
            onClick={onCtaClick}
            className="bg-[#121212] sm:bg-[#22c55e] hover:bg-[#22c55e] text-white px-8 py-4 sm:py-5 rounded-full font-black text-base sm:text-lg shadow-xl transition-all flex items-center justify-center gap-2"
          >
            Start Strategy Call <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button 
            onClick={onSecondaryClick}
            className="bg-white border-2 border-zinc-100 sm:border-zinc-200 hover:border-[#22c55e] hover:text-[#22c55e] text-zinc-600 px-8 py-4 sm:py-5 rounded-full font-black text-base sm:text-lg transition-all"
          >
            Our Services
          </button>
        </motion.div>
      </motion.div>
    </AuroraBackground>
  );
}
