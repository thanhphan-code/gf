import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function UnlockAnimation({ onComplete }) {
  // Call onComplete after 2.2 seconds (2s wait plus some buffer for transitions)
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate some celebratory sparkles
  const sparkles = useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // % of width
      y: Math.random() * 100, // % of height
      size: Math.random() * 15 + 10, // px
      delay: Math.random() * 0.5,
      duration: Math.random() * 1.5 + 1,
      angle: Math.random() * 360,
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 overflow-hidden select-none"
    >
      {/* Glow Backdrop */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[500px] h-[500px] rounded-full bg-pink-300/40 blur-[80px]"
      />

      {/* Floating Sparkles */}
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute text-pink-400 pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
          }}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{
            scale: [0, 1.2, 0],
            opacity: [0, 1, 0],
            rotate: [0, s.angle],
            y: [0, -30],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeOut',
          }}
        >
          {s.id % 2 === 0 ? '✨' : '💖'}
        </motion.div>
      ))}

      {/* Giant Heart */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{
          scale: [0, 1.25, 1],
          rotate: [0, -5, 0],
        }}
        transition={{
          type: 'spring',
          stiffness: 110,
          damping: 14,
          delay: 0.1,
        }}
        className="text-8xl md:text-9xl mb-8 filter drop-shadow-[0_10px_20px_rgba(244,95,148,0.3)]"
      >
        ❤️
      </motion.div>

      {/* Success Text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
        className="text-center px-6 max-w-lg z-10"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-600 mb-4 tracking-wide leading-tight">
          Chúc mừng bé 💕
        </h2>
        <p className="text-lg md:text-xl font-bold text-rose-500/90 leading-relaxed drop-shadow-sm">
          Em đã mở được cánh cửa ký ức của tụi mình.
        </p>
      </motion.div>
    </motion.div>
  );
}
