import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingHearts from './FloatingHearts';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import UnlockAnimation from './UnlockAnimation';

export default function UnlockGate({ onUnlock }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  const handleAnswerYes = () => {
    if (questionIndex < 4) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setShowUnlockAnimation(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center py-12 px-4 overflow-hidden select-none bg-gradient-to-br from-pink-50 via-pink-100/50 to-amber-50">
      {/* Floating background particles */}
      <FloatingHearts />

      {/* Decorative patterns */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(139, 105, 117, 0.04) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(139, 105, 117, 0.04) 25%, transparent 25%)
          `,
          backgroundSize: '26px 26px',
        }}
      />

      {/* Top Header Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="w-full text-center max-w-2xl mx-auto z-10 mb-6"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-rose-500 mb-4 filter drop-shadow-[0_2px_10px_rgba(244,95,148,0.15)] leading-tight">
          Bé iu ơi 💕
        </h1>
        <p className="text-sm md:text-base lg:text-lg font-bold text-rose-500/80 px-4 leading-relaxed">
          Anh có vài câu hỏi nhỏ trước khi cho em vào khu ký ức của tụi mình.
        </p>
      </motion.header>

      {/* Middle Interactive Section */}
      <main className="w-full flex-1 flex flex-col justify-center items-center z-10 py-4">
        {/* Progress Tracker */}
        <ProgressBar current={questionIndex + 1} total={5} />

        {/* Question Card */}
        <QuestionCard 
          questionIndex={questionIndex} 
          onAnswerYes={handleAnswerYes} 
        />
      </main>

      {/* Bottom Footer Section */}
      <footer className="w-full text-center z-10 text-xs font-semibold text-rose-400/80 mt-6 select-none">
        Make with love for my Thảo 🐰
      </footer>

      {/* Fullscreen Success Screen Transition */}
      <AnimatePresence>
        {showUnlockAnimation && (
          <UnlockAnimation onComplete={onUnlock} />
        )}
      </AnimatePresence>
    </div>
  );
}
