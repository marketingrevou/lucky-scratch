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
    <div className="w-full">
      {/* Desktop: single row of 5 */}
      <div className="hidden md:flex gap-4 justify-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            index={i}
            isSelected={selectedIndex === i}
            isLocked={isLocked && selectedIndex !== i}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>

      {/* Mobile: 3 + 2 rows */}
      <div className="flex flex-col items-center gap-4 md:hidden">
        <div className="flex gap-4 justify-center">
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
        <div className="flex gap-4 justify-center">
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
    </div>
  );
}
