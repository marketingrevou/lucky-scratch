"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onSubmit: (name: string, email: string) => void;
};

export default function UserInfoForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [formVisible, setFormVisible] = useState(false);

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
    <motion.div layout className="w-full max-w-md mx-auto">
      {/* Title — pops in first, then layout-animates upward when form appears */}
      <motion.div
        layout
        className="text-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.25, 1], opacity: 1 }}
        transition={{ duration: 0.55, times: [0, 0.55, 1], ease: [0.34, 1.56, 0.64, 1] }}
        onAnimationComplete={() => setFormVisible(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lucky-scratch-title.png"
          alt="Lucky Scratch!"
          className="mx-auto w-full"
          style={{ maxWidth: "300px" }}
        />
      </motion.div>

      {/* Subtitle + form + logo — slide in after title settles */}
      <AnimatePresence>
        {formVisible && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="mt-3 mb-8 text-base md:text-lg text-[#2D3436] font-bold text-center">
              Gosok kartu &amp; temukan kejutan gajianmu 🎁
            </p>

            {/* Form card — dark game panel */}
            <div
              className="rounded-3xl p-8"
              style={{
                background: "#1e3a8a",
                border: "3px solid #fede3e",
                boxShadow: "0 0 28px rgba(254,222,62,0.35), 0 10px 40px rgba(15,29,94,0.5)",
              }}
            >
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

                {/* CTA — red/orange gradient + 3D press */}
                <button
                  type="submit"
                  className="mt-2 w-full py-4 rounded-xl text-white font-black text-lg uppercase tracking-wide btn-pulse
                    transition-transform active:translate-y-1 hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #1e3a8a, #fcb031)" }}
                >
                  Ambil Hadiahku 🎁
                </button>
              </form>
            </div>

            {/* RevoU logo */}
            <div className="flex justify-center mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/revou-logo.png" alt="RevoU" className="h-10 drop-shadow" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
