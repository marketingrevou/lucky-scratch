"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  index: number;
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
  stackOffset?: { x: number; rotate: number; zIndex: number };
};

const ENTRY_ORIGINS = [
  { x: -300, y: -200 },
  { x: 0, y: -300 },
  { x: 300, y: -200 },
  { x: -300, y: 300 },
  { x: 300, y: 300 },
];

export default function Card({ index, isSelected, isLocked, onClick, stackOffset }: Props) {
  const origin = ENTRY_ORIGINS[index] ?? { x: 0, y: -300 };

  return (
    <motion.div
      initial={{ x: origin.x, y: origin.y, opacity: 0, scale: 0.6, rotate: stackOffset?.rotate ?? 0 }}
      animate={{
        x: 0,
        y: 0,
        opacity: isLocked && !isSelected ? 0.3 : 1,
        scale: isSelected ? 1.08 : isLocked ? 0.95 : 1,
        rotate: isSelected ? 0 : (stackOffset?.rotate ?? 0),
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: index * 0.08,
        opacity: { duration: 0.3 },
        scale: { type: "spring", stiffness: 300, damping: 25 },
      }}
      whileHover={!isLocked ? { rotate: [0, -3, 3, -1, 0], scale: 1.05, transition: { duration: 0.4 } } : {}}
      onClick={!isLocked ? onClick : undefined}
      className="relative cursor-pointer select-none"
      style={{
        pointerEvents: isLocked && !isSelected ? "none" : "auto",
        filter: isLocked && !isSelected ? "grayscale(1)" : "none",
        ...(stackOffset ? { position: "absolute", left: stackOffset.x, zIndex: stackOffset.zIndex } : {}),
      }}
    >
<div
        className="relative w-[120px] h-[160px] md:w-[160px] md:h-[220px] rounded-3xl overflow-hidden transition-all"
        style={{
          boxShadow: isSelected ? "0 0 28px 6px rgba(254,222,62,0.5)" : "none",
        }}
      >
        <Image
          src="/cardback.webp"
          alt="Lucky Card"
          fill
          sizes="160px"
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}
