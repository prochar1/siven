"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface HandAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function HandAnimation({
  isVisible,
  onComplete,
}: HandAnimationProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    if (isVisible) {
      // Defer setting state to avoid synchronous setState inside effect
      showTimer = setTimeout(() => {
        setShouldRender(true);
        hideTimer = setTimeout(() => {
          setShouldRender(false);
          onComplete?.();
        }, 3000); // Animation lasts 3 seconds
      }, 0);
    }

    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => {
            setShouldRender(false);
            onComplete?.();
          }}
          className="fixed inset-0 flex items-center justify-center cursor-pointer z-[100] bg-black/60 backdrop-blur-md"
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              className="flex gap-12 mb-8"
              initial={{ y: 0 }}
              animate={{
                y: [0, -60, 0, -60, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Left Hand */}
              <svg
                width="200"
                height="200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFD700"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]"
              >
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
              </svg>

              {/* Right Hand */}
              <svg
                width="200"
                height="200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFD700"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="scale-x-[-1] drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]"
              >
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
              </svg>
            </motion.div>

            <motion.h2
              className="!text-[24rem] font-black text-yellow-400 drop-shadow-[0_0_40px_rgba(255,215,0,1)] leading-none mt-[-2rem]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <span style={{ fontSize: "12rem" }}>67!</span>
            </motion.h2>

            <div className="mt-20 px-8 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 animate-bounce">
              <p className="text-white text-lg font-bold uppercase tracking-[0.2em]">
                Klikni pro pokračování
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
