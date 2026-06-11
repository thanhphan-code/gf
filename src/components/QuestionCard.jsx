import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  "Em có nhớ anh không? 🥺",
  "Em có thương anh không? 💖",
  "Em có muốn xem kỷ niệm của tụi mình không? 📸",
  "Em có thấy anh đáng yêu không? 😆",
  "Em có đồng ý mở cánh cửa ký ức không? ✨"
];

const FUNNY_MESSAGES = [
  "Ơ kìa 😝",
  "Bấm Có đi mà 🥺",
  "Nút này hư rồi 😆",
  "Sai đáp án rồi bé 😜",
  "Hổng cho bấm đâuuu 🤫",
  "Suy nghĩ kỹ lại đi nha 😏",
  "Nút Có bên cạnh kìa bé iu 👉👈"
];

export default function QuestionCard({ questionIndex, onAnswerYes }) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isAbsolute, setIsAbsolute] = useState(false);
  const [noRotation, setNoRotation] = useState(0);
  const [noScale, setNoScale] = useState(1);
  const [noText, setNoText] = useState("Không 😶");
  const [particles, setParticles] = useState([]);

  // Reset No button state when question changes
  useEffect(() => {
    setIsAbsolute(false);
    setNoPosition({ x: 0, y: 0 });
    setNoRotation(0);
    setNoScale(1);
    setNoText("Không 😶");
  }, [questionIndex]);

  const handleNoMove = (e) => {
    // Avoid double trigger on touch screens
    if (e.type === 'touchstart') {
      e.preventDefault();
    }

    const buttonWidth = 140;
    const buttonHeight = 48;
    const padding = 24;

    const maxX = window.innerWidth - buttonWidth - padding;
    const maxY = window.innerHeight - buttonHeight - padding;

    let newX = Math.random() * (maxX - padding) + padding;
    let newY = Math.random() * (maxY - padding) + padding;

    // Make sure it doesn't spawn right where the mouse/touch is
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    if (clientX && clientY) {
      const distToCursor = Math.hypot(newX - clientX, newY - clientY);
      if (distToCursor < 180) {
        newX = Math.random() * (maxX - padding) + padding;
        newY = Math.random() * (maxY - padding) + padding;
      }
    }

    setNoPosition({ x: newX, y: newY });
    setIsAbsolute(true);
    setNoRotation(Math.random() * 24 - 12); // slightly rotate -12deg to 12deg
    setNoScale(Math.random() * 0.3 + 0.85); // scale between 0.85 and 1.15

    // Choose a random funny message different from the current one
    let randomMsg = FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)];
    while (randomMsg === noText) {
      randomMsg = FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)];
    }
    setNoText(randomMsg);
  };

  const handleYesClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Spawn heart particles explosion
    const newParticles = Array.from({ length: 20 }).map((_, i) => {
      const angle = (i / 20) * Math.PI * 2 + (Math.random() * 0.5 - 0.25);
      const speed = Math.random() * 120 + 60;
      return {
        id: Date.now() + i + Math.random(),
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        emoji: ['💖', '💕', '❤️', '💝', '🌸', '✨'][Math.floor(Math.random() * 6)],
        size: Math.random() * 14 + 14,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Clean up particles
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1000);

    // Short delay to let the user see the explosion/hearts before changing question
    setTimeout(() => {
      onAnswerYes();
    }, 400);
  };

  return (
    <>
      {/* Particle explosion layer */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed pointer-events-none z-50 select-none text-center"
          style={{ left: p.x, top: p.y, fontSize: `${p.size}px` }}
          initial={{ x: -p.size/2, y: -p.size/2, scale: 0.4, opacity: 1 }}
          animate={{
            x: p.dx,
            y: p.dy,
            scale: [0.4, 1.4, 0.2],
            opacity: [1, 1, 0],
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          {p.emoji}
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        <motion.div
          key={questionIndex}
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -15 }}
          transition={{ type: 'spring', stiffness: 100, damping: 18 }}
          className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl border border-white/80 bg-white/60 backdrop-blur-xl shadow-[0_24px_50px_rgba(244,95,148,0.15)] text-center relative overflow-hidden"
        >
          {/* Bunny Decoration in background */}
          <div className="absolute -top-4 -right-4 text-6xl opacity-10 select-none">🐰</div>
          <div className="absolute -bottom-6 -left-6 text-6xl opacity-10 select-none">💕</div>

          <p className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
            {QUESTIONS[questionIndex]}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center min-h-[64px]">
            {/* Có (Yes) Button */}
            <motion.button
              onClick={handleYesClick}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-36 h-12 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 text-white font-bold shadow-[0_8px_20px_rgba(244,95,148,0.3)] hover:shadow-[0_12px_24px_rgba(244,95,148,0.4)] transition-shadow cursor-pointer select-none"
            >
              Có 💕
            </motion.button>

            {/* Không (No) Button */}
            <motion.button
              onMouseEnter={handleNoMove}
              onTouchStart={handleNoMove}
              onClick={handleNoMove}
              animate={
                isAbsolute
                  ? {
                      x: noPosition.x,
                      y: noPosition.y,
                      rotate: noRotation,
                      scale: noScale,
                      position: 'fixed',
                      left: 0,
                      top: 0,
                      zIndex: 100,
                    }
                  : {
                      x: 0,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                      position: 'relative',
                    }
              }
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className={`w-36 h-12 rounded-2xl border border-pink-200 bg-white/90 text-rose-500 font-bold shadow-[0_6px_14px_rgba(0,0,0,0.05)] select-none whitespace-nowrap overflow-hidden text-ellipsis px-2 ${
                isAbsolute ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              {noText}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
