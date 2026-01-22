"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data, headerTitle, headerDescription }: { data: TimelineEntry[], headerTitle?: string, headerDescription?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white font-sans px-5 md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto pt-16 md:pt-20 px-0 md:px-8 lg:px-10">
        <h2 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 sm:mb-10 tracking-tighter leading-[0.9] text-[#121212] max-w-4xl">
          {headerTitle || "Our Process"}
        </h2>
        <p className="text-zinc-500 text-lg sm:text-2xl font-bold max-w-2xl leading-relaxed">
          {headerDescription || "Premium design solutions tailored for conversion and long-term authority."}
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-16 md:pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-12 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-32 sm:top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-8 w-8 sm:h-10 sm:w-10 absolute left-0 md:left-3 rounded-full bg-white flex items-center justify-center border border-zinc-100 shadow-sm">
                <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#22c55e]" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-black text-zinc-900 tracking-tighter">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-12 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl sm:text-3xl mb-4 text-left font-black text-zinc-900 tracking-tighter">
                {item.title}
              </h3>
              <div className="text-sm sm:text-base">
                {item.content}
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-[15px] sm:left-8 md:left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-[#22c55e] via-[#1da84d] to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
