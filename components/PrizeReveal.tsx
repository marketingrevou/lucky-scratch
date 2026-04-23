"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Prize } from "@/lib/prizes";

type Props = {
  prize: Prize;
  userName: string;
  onPlayAgain: () => void;
};

const STAR_BURST = [
  { tx: "-70px", ty: "-70px", delay: "0.3s" },
  { tx: "0px",   ty: "-90px", delay: "0.35s" },
  { tx: "70px",  ty: "-70px", delay: "0.4s" },
  { tx: "-90px", ty: "0px",   delay: "0.45s" },
  { tx: "90px",  ty: "0px",   delay: "0.5s" },
  { tx: "0px",   ty: "90px",  delay: "0.55s" },
];

export default function PrizeReveal({ prize, userName, onPlayAgain }: Props) {
  const firedRef = useRef(false);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCard(true), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showCard) return;
    if (firedRef.current) return;
    firedRef.current = true;

    import("canvas-confetti").then(({ default: confetti }) => {
      const colors = ["#fede3e", "#fcb031", "#FFFFFF", "#1e3a8a"];

      confetti({ particleCount: 140, spread: 90, origin: { y: 0.55 }, colors, scalar: 1.3 });
      setTimeout(() => {
        confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors });
        confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors });
      }, 300);
    });
  }, [showCard]);

  return (
    <AnimatePresence mode="wait">
      {!showCard ? (
        <motion.div
          key="congrats"
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.88)", zIndex: 40 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            className="w-full"
            style={{ maxWidth: "380px" }}
          >
            <Image
              src="/prize.webp"
              alt="You're Lucky!"
              width={760}
              height={380}
              priority
              className="w-full h-auto"
            />
          </motion.div>
        </motion.div>
      ) : (

        <motion.div
          key="card"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="flex flex-col items-center gap-6 text-center w-full max-w-md mx-auto"
        >
        {/* Celebration card — matches form panel */}
        <div
          className="rounded-3xl px-8 py-10 w-full"
          style={{
            background: "#1e3a8a",
            border: "3px solid #fede3e",
            boxShadow: "0 0 28px rgba(254,222,62,0.35), 0 10px 40px rgba(15,29,94,0.5)",
          }}
        >
          {/* Prize emoji + star burst */}
          <div className="relative flex justify-center mb-4">
            {STAR_BURST.map((s, i) => (
              <span
                key={i}
                className="star-burst-item"
                style={{ "--tx": s.tx, "--ty": s.ty, animationDelay: s.delay } as React.CSSProperties}
              >
                ⭐
              </span>
            ))}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10, delay: 0.2 }}
              className="text-7xl"
            >
              {prize.emoji}
            </motion.div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 text-3d"
            style={{ fontFamily: "'Red Hat Display', sans-serif" }}
          >
            {prize.label}
          </motion.h2>

          <p className="text-sm text-white/60 mb-6">{prize.description}</p>

          <div
            className="rounded-xl px-4 py-3 text-sm font-bold text-[#2D3436]"
            style={{ background: "#fede3e" }}
          >
            Segera hubungi Admission Counselor-mu untuk langkah selanjutnya 📞
          </div>

        </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
