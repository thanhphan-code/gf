import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function FloatingHearts() {
  const items = useMemo(() => {
    const arr = [];
    const symbols = ['💕', '💖', '🌸', '✨', '🌸', '❤️', '🎈', '🐰'];
    for (let i = 0; i < 40; i++) {
      arr.push({
        id: i,
        symbol: symbols[i % symbols.length],
        x: Math.random() * 100, // percent of width
        size: Math.random() * 18 + 12, // font size in px
        delay: Math.random() * -25, // offset start times so they appear instantly
        duration: Math.random() * 10 + 8, // speed of movement
        drift: Math.random() * 100 - 50, // horizontal drift path
      });
    }
    return arr;
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{
            left: `${item.x}%`,
            fontSize: `${item.size}px`,
          }}
          initial={{ y: '110vh', opacity: 0, scale: 0.5, rotate: 0 }}
          animate={{
            y: '-15vh',
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.5, 1.2, 1.2, 0.6],
            x: [
              `0px`, 
              `${item.drift}px`, 
              `${-item.drift}px`,
              `0px`
            ],
            rotate: [0, item.drift, -item.drift, item.drift * 2],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut',
          }}
        >
          {item.symbol}
        </motion.div>
      ))}
    </div>
  );
}
