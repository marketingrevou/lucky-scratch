"use client";

import { useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UserInfoForm from "@/components/UserInfoForm";
import CardGrid from "@/components/CardGrid";
import ScratchCard from "@/components/ScratchCard";
import PrizeReveal from "@/components/PrizeReveal";
import { selectPrize, type Prize } from "@/lib/prizes";

type Stage = "form" | "cards" | "scratch" | "reveal";

export default function Home() {
  const [stage, setStage] = useState<Stage>("form");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [saving, setSaving] = useState(false);
  const revealedRef = useRef(false);

  function handleFormSubmit(name: string, email: string) {
    setUserName(name);
    setUserEmail(email);
    setStage("cards");
  }

  function handleCardSelect(index: number) {
    if (selectedCard !== null) return;
    const won = selectPrize();
    setPrize(won);
    setSelectedCard(index);
    setTimeout(() => setStage("scratch"), 700);
  }

  const handleRevealed = useCallback(async () => {
    if (!prize || revealedRef.current) return;
    revealedRef.current = true;
    setStage("reveal");

    try {
      await fetch("/api/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, email: userEmail, prize: prize.label }),
      });
    } catch {
      // non-blocking — game already revealed
    }
  }, [prize, userName, userEmail]);

  function handlePlayAgain() {
    revealedRef.current = false;
    setStage("form");
    setSelectedCard(null);
    setPrize(null);
  }

  return (
    <main className="sunburst-bg min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Floating star decorations */}
      <span className="star-float" style={{ top: "8%", left: "6%", animationDelay: "0s" }}>✨</span>
      <span className="star-float" style={{ top: "15%", right: "7%", animationDelay: "0.8s" }}>⭐</span>
      <span className="star-float" style={{ top: "55%", left: "3%", animationDelay: "1.6s" }}>🌟</span>
      <span className="star-float" style={{ top: "70%", right: "5%", animationDelay: "0.4s" }}>✨</span>
      <span className="star-float" style={{ top: "80%", left: "25%", animationDelay: "1.2s" }}>🌟</span>
      <span className="star-float" style={{ top: "40%", right: "2%", animationDelay: "2.4s" }}>✨</span>
      <span className="star-float" style={{ top: "88%", right: "20%", animationDelay: "0.6s" }}>⭐</span>
      <span className="star-float" style={{ top: "30%", left: "2%", animationDelay: "2.0s" }}>🌟</span>

      <AnimatePresence mode="wait">
        {stage === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center"
          >
            <UserInfoForm onSubmit={handleFormSubmit} />
          </motion.div>
        )}

        {stage === "cards" && (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center gap-6"
          >
            <div className="text-center mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/pilihkartu-mb.png"
                alt="Pilih Kartumu"
                className="mx-auto w-full"
                style={{ maxWidth: "300px" }}
              />
            </div>

            <CardGrid selectedIndex={selectedCard} onSelect={handleCardSelect} />

            <div className="mt-4 opacity-60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/revou-logo.png" alt="RevoU" className="h-8" />
            </div>
          </motion.div>
        )}

        {stage === "scratch" && prize && (
          <motion.div
            key="scratch"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ambilhadiah-mb.png"
              alt="Ambil Hadiahmu"
              className="mx-auto w-full"
              style={{ maxWidth: "300px" }}
            />

            <ScratchCard prize={prize} onRevealed={handleRevealed} />
          </motion.div>
        )}

        {stage === "reveal" && prize && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center"
          >
            <PrizeReveal prize={prize} userName={userName} onPlayAgain={handlePlayAgain} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
