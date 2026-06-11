import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-6 px-4">
      <div className="flex justify-between items-center mb-2 text-rose-500 font-bold text-sm md:text-base">
        <span>Câu hỏi {current} / {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="relative w-full h-4 bg-pink-100 rounded-full border border-pink-200/50 shadow-inner overflow-visible">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-300 to-rose-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 70, damping: 15 }}
        />
        {/* Pulsating progress heart tracker */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-lg z-10"
          animate={{
            left: `${percentage}%`,
            scale: [1, 1.28, 1],
          }}
          transition={{
            left: { type: 'spring', stiffness: 70, damping: 15 },
            scale: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
          }}
        >
          💖
        </motion.div>
      </div>
    </div>
  );
}
