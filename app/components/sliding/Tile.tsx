'use client';

import { motion } from 'framer-motion';

interface TileProps {
  value: number;
  onClick: () => void;
  disabled: boolean;
}

export default function Tile({ value, onClick, disabled }: TileProps) {
  const isEmpty = value === 0;

  return (
    <motion.button
      // The 'layout' prop automatically animates changes in position
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onClick={onClick}
      disabled={disabled || isEmpty}
      // Aspect ratio keeps it a perfect square
      style={{ aspectRatio: '1 / 1' }}
      className={`
        flex items-center justify-center text-3xl sm:text-4xl font-bold rounded-xl select-none
        ${
          isEmpty
            ? 'bg-transparent shadow-none cursor-default'
            : 'bg-slate-700 text-slate-100 hover:bg-slate-600 shadow-[0_4px_0_0_#0f172a] active:shadow-[0_0px_0_0_#0f172a] active:translate-y-1 transition-colors cursor-pointer border border-slate-600'
        }
        ${disabled && !isEmpty ? 'opacity-80 cursor-not-allowed' : ''}
      `}
    >
      {!isEmpty && value}
    </motion.button>
  );
}