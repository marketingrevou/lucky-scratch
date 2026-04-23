"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Prize } from "@/lib/prizes";

type Props = {
  prize: Prize;
  onRevealed: () => void;
  onScratchStart?: () => void;
  onScratchStop?: () => void;
};

const REVEAL_THRESHOLD = 0.8;
const BRUSH_RADIUS = 28;

function drawGoldFoil(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Base gold gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#E8C84A");
  grad.addColorStop(0.3, "#D4AF37");
  grad.addColorStop(0.6, "#C9A227");
  grad.addColorStop(0.8, "#E8C84A");
  grad.addColorStop(1, "#B8960C");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Brushed metal texture: fine horizontal lines
  ctx.globalAlpha = 0.08;
  for (let y = 0; y < h; y += 3) {
    ctx.strokeStyle = y % 6 === 0 ? "#fff" : "#8B6914";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // "GOSOK DI SINI" text
  ctx.font = "bold 20px 'Red Hat Display', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🤫 GOSOK DI SINI", w / 2, h / 2 - 10);
  ctx.font = "13px 'Red Hat Display', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.fillText("hadiah menantimu...", w / 2, h / 2 + 16);
}

function getErasedPercent(ctx: CanvasRenderingContext2D, w: number, h: number): number {
  const imageData = ctx.getImageData(0, 0, w, h);
  let transparent = 0;
  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] < 128) transparent++;
  }
  return transparent / (w * h);
}

export default function ScratchCard({ prize, onRevealed, onScratchStart, onScratchStop }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isScratching = useRef(false);
  const rafPending = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    drawGoldFoil(ctx, w, h);
  }, []);

  const scratch = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas || revealed) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const cx = (x - rect.left) * scaleX;
      const cy = (y - rect.top) * scaleY;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(cx, cy, BRUSH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // Defer the expensive GPU readback to once per animation frame
      if (!rafPending.current) {
        rafPending.current = true;
        requestAnimationFrame(() => {
          rafPending.current = false;
          const c = canvasRef.current;
          if (!c) return;
          const cx2d = c.getContext("2d");
          if (!cx2d) return;
          const percent = getErasedPercent(cx2d, c.width, c.height);
          if (percent >= REVEAL_THRESHOLD) {
            cx2d.clearRect(0, 0, c.width, c.height);
            setRevealed(true);
            isScratching.current = false;
            onScratchStop?.();
            onRevealed();
          }
        });
      }
    },
    [revealed, onRevealed]
  );

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => { isScratching.current = true; onScratchStart?.(); scratch(e.clientX, e.clientY); };
  const onMouseMove = (e: React.MouseEvent) => { if (isScratching.current) scratch(e.clientX, e.clientY); };
  const onMouseUp = () => { isScratching.current = false; onScratchStop?.(); };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => { e.preventDefault(); isScratching.current = true; onScratchStart?.(); scratch(e.touches[0].clientX, e.touches[0].clientY); };
  const onTouchMove = (e: React.TouchEvent) => { e.preventDefault(); if (isScratching.current) scratch(e.touches[0].clientX, e.touches[0].clientY); };
  const onTouchEnd = () => { isScratching.current = false; onScratchStop?.(); };

  return (
    <div className="relative w-[280px] h-[180px] md:w-[320px] md:h-[200px] rounded-2xl overflow-hidden"
      style={{
        border: "2px solid #D4AF37",
        boxShadow: "0 0 20px rgba(212,175,55,0.4), 0 6px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Prize layer (underneath) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#F5F5F5]">
        <span className="text-5xl">{prize.emoji}</span>
        <p
          className="text-center font-black text-[#2D3436] text-sm md:text-base px-4 leading-tight"
          style={{ fontFamily: "'Red Hat Display', sans-serif" }}
        >
          {prize.label}
        </p>
        <p className="text-xs text-[#2D3436]/60 text-center px-4">{prize.description}</p>
      </div>

      {/* Gold foil canvas (on top) */}
      <canvas
        ref={canvasRef}
        width={320}
        height={200}
        className="absolute inset-0 w-full h-full touch-none"
        style={{ cursor: revealed ? "default" : "crosshair" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
    </div>
  );
}
