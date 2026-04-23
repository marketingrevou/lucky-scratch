export type Prize = {
  id: string;
  label: string;
  emoji: string;
  description: string;
};

export const PRIZES: Prize[] = [
  {
    id: "full",
    label: "BNSP + AI Free Learning + Starter Kit",
    emoji: "🏆",
    description: "Paket lengkap untuk karier tech-mu!",
  },
  {
    id: "bnsp",
    label: "BNSP + Starter Kit",
    emoji: "🎓",
    description: "Sertifikasi nasional + perlengkapan belajar",
  },
  {
    id: "ai",
    label: "AI Free Learning + Starter Kit",
    emoji: "🤖",
    description: "Belajar AI gratis + perlengkapan belajar",
  },
];

export function selectPrize(): Prize {
  const r = Math.random();
  if (r < 0.5) return PRIZES[0];
  if (r < 0.75) return PRIZES[1];
  return PRIZES[2];
}

export const SWE_PRIZES: Prize[] = [
  {
    id: "swe-refund",
    label: "Jaminan Refund Rp3,000,000",
    emoji: "💰",
    description: "Garansi refund jika tidak puas dengan program!",
  },
  {
    id: "swe-refund-full",
    label: "Jaminan Refund Rp3,000,000 + AI video learning + Starter Kit",
    emoji: "🏆",
    description: "Paket lengkap: refund, belajar AI, dan perlengkapan belajar!",
  },
  {
    id: "swe-refund-ai",
    label: "Jaminan Refund Rp3,000,000 + AI video learning",
    emoji: "🤖",
    description: "Refund garansi plus akses belajar AI gratis!",
  },
];

export function selectSWEPrize(): Prize {
  const idx = Math.floor(Math.random() * SWE_PRIZES.length);
  return SWE_PRIZES[idx];
}
