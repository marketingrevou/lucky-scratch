"use client";

import { motion } from "framer-motion";
import Card from "./Card";

type Props = {
  selectedIndex: number | null;
  onSelect: (index: number) => void;
};

export default function CardGrid({ selectedIndex, onSelect }: Props) {
  const isLocked = selectedIndex !== null;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Row 1: 3 cards */}
      <div className="flex gap-4 justify-center flex-wrap">
        {[0, 1, 2].map((i) => (
          <Card
            key={i}
            index={i}
            isSelected={selectedIndex === i}
            isLocked={isLocked && selectedIndex !== i}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>

      {/* Row 2: 2 cards centered */}
      <div className="flex gap-4 justify-center flex-wrap">
        {[3, 4].map((i) => (
          <Card
            key={i}
            index={i}
            isSelected={selectedIndex === i}
            isLocked={isLocked && selectedIndex !== i}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
}
