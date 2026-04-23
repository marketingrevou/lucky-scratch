"use client";

import { useState, useCallback, useRef } from "react";
import { useGameSounds } from "@/hooks/useGameSounds";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import UserInfoForm from "@/components/UserInfoForm";
import CardGrid from "@/components/CardGrid";
import ScratchCard from "@/components/ScratchCard";
import PrizeReveal from "@/components/PrizeReveal";
import { selectPrize, selectSWEPrize, type Prize } from "@/lib/prizes";

type Stage = "form" | "cards" | "scratch" | "reveal";

type Props = {
  variant?: "default" | "swe";
};

function pickPrize(variant: "default" | "swe"): Prize {
  return variant === "swe" ? selectSWEPrize() : selectPrize();
}

export default function LuckyCardGame({ variant = "default" }: Props) {
  const [stage, setStage] = useState<Stage>("form");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [prize, setPrize] = useState<Prize | null>(null);
  const revealedRef = useRef(false);

  const {
    startTheme, stopTheme,
    playTitleEntrance, playEntrance,
    playCardSelect,
    startScratch, stopScratch,
    playReveal,
    playPlayAgain,
  } = useGameSounds();

  function handleFormSubmit(name: string, email: string) {
    setUserName(name);
    setUserEmail(email);
    setStage("cards");
    startTheme();
    playEntrance();
  }

  function handleCardSelect(index: number) {
    if (selectedCard !== null) return;
    playCardSelect();
    const won = pickPrize(variant);
    setPrize(won);
    setSelectedCard(index);
    setTimeout(() => setStage("scratch"), 700);
  }

  const handleRevealed = useCallback(async () => {
    if (!prize || revealedRef.current) return;
    revealedRef.current = true;
    playReveal();
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
  }, [prize, userName, userEmail, playReveal]);

  function handlePlayAgain() {
    stopTheme();
    playPlayAgain();
    revealedRef.current = false;
    setStage("form");
    setSelectedCard(null);
    setPrize(null);
    startTheme();
  }

  return (
    <main className="sunburst-bg h-dvh flex flex-col items-center justify-center px-4 py-4 overflow-hidden">
      {/* Floating coin decorations */}
      {[
        { top: "8%",  left:  "6%",   delay: "0s"   },
        { top: "15%", right: "7%",   delay: "0.8s" },
        { top: "55%", left:  "3%",   delay: "1.6s" },
        { top: "70%", right: "5%",   delay: "0.4s" },
        { top: "80%", left:  "25%",  delay: "1.2s" },
        { top: "40%", right: "2%",   delay: "2.4s" },
        { top: "88%", right: "20%",  delay: "0.6s" },
        { top: "30%", left:  "2%",   delay: "2.0s" },
      ].map((pos, i) => (
        <div key={i} className="coin-float" style={{ top: pos.top, left: pos.left, right: pos.right, animationDelay: pos.delay }}>
          <DotLottieReact
            src="https://lottie.host/faf84856-83c2-41b1-bb75-4079ed03bd33/1x1cudw5Lq.lottie"
            loop
            autoplay
          />
        </div>
      ))}

      <AnimatePresence mode="wait">
        {stage === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center"
          >
            <UserInfoForm onSubmit={handleFormSubmit} onEnter={playTitleEntrance} />
          </motion.div>
        )}

        {stage === "cards" && (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center gap-3"
          >
            <div className="text-center">
              <Image
                src="/pilihkartu-mb.webp"
                alt="Pilih Kartumu"
                width={600}
                height={300}
                className="mx-auto w-full"
                style={{ maxWidth: "220px" }}
              />
            </div>

            <CardGrid selectedIndex={selectedCard} onSelect={handleCardSelect} />

            <div className="opacity-60">
              <Image src="/revou-logo.webp" alt="RevoU" width={80} height={80} className="h-8 w-auto" />
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
            <Image
              src="/ambilhadiah-mb.webp"
              alt="Ambil Hadiahmu"
              width={600}
              height={300}
              className="mx-auto w-full"
              style={{ maxWidth: "300px" }}
            />

            <ScratchCard prize={prize} onRevealed={handleRevealed} onScratchStart={startScratch} onScratchStop={stopScratch} />
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
