export type Prize = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  /** Relative chance of being drawn, expressed in percent. 0 = disabled. */
  weight: number;
};

export const PRIZES: Prize[] = [
  {
    id: "ai",
    label: "AI Free Learning + Starter Kit",
    emoji: "🤖",
    description: "Belajar AI gratis + perlengkapan belajar",
    weight: 50,
  },
  {
    id: "bnsp",
    label: "BNSP + Starter Kit",
    emoji: "🎓",
    description: "Sertifikasi nasional + perlengkapan belajar",
    weight: 30,
  },
  {
    id: "full",
    label: "BNSP + AI Free Learning + Starter Kit",
    emoji: "🏆",
    description: "Paket lengkap untuk karier tech-mu!",
    weight: 20,
  },
];

export const SWE_PRIZES: Prize[] = [
  {
    id: "swe-diskon-2jt",
    label: "Diskon Rp 2.000.000",
    emoji: "🏆",
    description: "Potongan terbesar untuk program Software Engineering!",
    weight: 5,
  },
  {
    id: "swe-diskon-1500rb",
    label: "Diskon Rp 1.500.000",
    emoji: "💰",
    description: "Potongan biaya program Software Engineering",
    weight: 95,
  },
  {
    id: "swe-diskon-1jt",
    label: "Diskon Rp 1.000.000",
    emoji: "🎟️",
    description: "Potongan biaya program Software Engineering",
    weight: 0,
  },
];

function pickWeighted(prizes: Prize[]): Prize {
  const eligible = prizes.filter((p) => p.weight > 0);
  const pool = eligible.length > 0 ? eligible : prizes;
  const total = pool.reduce((sum, p) => sum + p.weight, 0);

  let r = Math.random() * total;
  for (const prize of pool) {
    r -= prize.weight;
    if (r < 0) return prize;
  }
  return pool[pool.length - 1];
}

export function selectPrize(): Prize {
  return pickWeighted(PRIZES);
}

export function selectSWEPrize(): Prize {
  return pickWeighted(SWE_PRIZES);
}
