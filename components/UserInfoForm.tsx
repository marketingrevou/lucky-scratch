"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  onSubmit: (name: string, email: string) => void;
  onEnter?: () => void;
};

// Using named variants avoids the keyframe-array → single-value reset bug in framer-motion.
// When animate switches between variant names, framer-motion interpolates from the current
// animated value rather than jumping back to the first keyframe.
const titleVariants = {
  hidden:  { scale: 0,    opacity: 0 },
  entered: { scale: 1.25, opacity: 1 },
  settled: { scale: 0.78, opacity: 1 },
};

export default function UserInfoForm({ onSubmit, onEnter }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  // "entered"  → title pops in and stays
  // "moving"   → title moves up + scales down, form is in DOM (opacity 0)
  // "visible"  → form fades in
  const [phase, setPhase] = useState<"entered" | "moving" | "visible">("entered");
  const phaseFired = useRef(false);

  useEffect(() => { onEnter?.(); }, []);

  function validate() {
    const errs: { name?: string; email?: string } = {};
    if (!name.trim()) errs.name = "Nama tidak boleh kosong";
    if (!email.trim()) errs.email = "Email tidak boleh kosong";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format email tidak valid";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(name.trim(), email.trim());
  }

  return (
    <motion.div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Title — pops in via spring, stays, then layout-moves up + scales to settled */}
      <motion.div
        layout
        className="text-center"
        variants={titleVariants}
        initial="hidden"
        animate={phase === "entered" ? "entered" : "settled"}
        transition={
          phase === "entered"
            ? {
                scale: { type: "spring", stiffness: 260, damping: 12 },
                opacity: { duration: 0.25 },
              }
            : {
                duration: 0.7,
                ease: "easeInOut",
                layout: { duration: 0.7, ease: "easeInOut" },
              }
        }
        onAnimationComplete={(def) => {
          // Only act on the initial pop-in completing, not on subsequent animations
          if (def !== "entered" || phaseFired.current) return;
          phaseFired.current = true;
          setTimeout(() => setPhase("moving"), 700);    // stay 0.7s then move
          setTimeout(() => setPhase("visible"), 1400);  // form fades in 700ms into the move
        }}
      >
        <Image
          src="/lucky-scratch-title.webp"
          alt="Lucky Scratch!"
          width={600}
          height={300}
          priority
          className="mx-auto w-full"
          style={{ maxWidth: "300px" }}
        />
      </motion.div>

      {/* Form — in DOM (invisible) while title moves up, then fades in */}
      {phase !== "entered" && (
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase === "visible" ? 1 : 0, y: phase === "visible" ? 0 : 20 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Form card — dark game panel */}
          <div
            className="rounded-3xl p-6"
            style={{
              background: "#1e3a8a",
              border: "3px solid #fede3e",
              boxShadow: "0 0 28px rgba(254,222,62,0.35), 0 10px 40px rgba(15,29,94,0.5)",
            }}
          >
            <p className="mb-4 text-base md:text-lg text-white font-bold text-center">
              Gosok kartu &amp; temukan kejutan gajianmu 🎁
            </p>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-[#fede3e]">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan namamu"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-white text-base outline-none transition-all placeholder:text-white/30
                    ${errors.name ? "border-[#ef3d58]" : "border-[#2d50a8] focus:border-[#fede3e]"}`}
                  style={{ background: "#162d6e" }}
                />
                {errors.name && <p className="text-xs text-[#ef3d58] mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-[#fede3e]">Email</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-white text-base outline-none transition-all placeholder:text-white/30
                    ${errors.email ? "border-[#ef3d58]" : "border-[#2d50a8] focus:border-[#fede3e]"}`}
                  style={{ background: "#162d6e" }}
                />
                {errors.email && <p className="text-xs text-[#ef3d58] mt-1">{errors.email}</p>}
              </div>

              {/* CTA */}
              <button
                type="submit"
                className="mt-2 w-full py-4 rounded-xl font-black text-lg uppercase tracking-wide btn-pulse
                  transition-transform active:translate-y-1 hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, #fcb031, #fede3e)",
                  color: "#1e3a8a",
                }}
              >
                Pilih Kartu Sekarang
              </button>
            </form>
          </div>

          {/* RevoU logo */}
          <div className="flex justify-center mt-4">
            <Image src="/revou-logo.webp" alt="RevoU" width={80} height={80} className="h-10 w-auto drop-shadow" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
