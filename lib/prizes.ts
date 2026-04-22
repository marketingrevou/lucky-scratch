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
