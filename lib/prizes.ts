export type Prize = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  /** Relative chance of being drawn, expressed in percent. 0 = disabled. */
  weight: number;
  /** Program price before/after discount, shown as a strikethrough → final price. */
  originalPrice?: string;
  finalPrice?: string;
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

export const DA_PRIZES: Prize[] = [
  {
    id: "da-diskon-4jt",
    label: "Diskon Rp 4.000.000",
    emoji: "🏆",
    description: "Potongan biaya program Data Analytics",
    weight: 100,
    originalPrice: "Rp 20.999.000",
    finalPrice: "Rp 16.999.000",
  },
];

export const DM_PRIZES: Prize[] = [
  {
    id: "dm-diskon-4jt",
    label: "Diskon Rp 4.000.000",
    emoji: "🏆",
    description: "Potongan biaya program Digital Marketing",
    weight: 100,
    originalPrice: "Rp 17.999.000",
    finalPrice: "Rp 13.999.000",
  },
];

export const SWE_PRIZES: Prize[] = [
  {
    id: "swe-diskon-5500rb",
    label: "Diskon Rp 5.500.000",
    emoji: "🏆",
    description: "Potongan biaya program Software Engineering",
    weight: 100,
    originalPrice: "Rp 22.500.000",
    finalPrice: "Rp 17.000.000",
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

export type Variant = "default" | "da" | "dm" | "swe";

const PRIZES_BY_VARIANT: Record<Variant, Prize[]> = {
  default: PRIZES,
  da: DA_PRIZES,
  dm: DM_PRIZES,
  swe: SWE_PRIZES,
};

export function selectPrize(variant: Variant = "default"): Prize {
  return pickWeighted(PRIZES_BY_VARIANT[variant]);
}
