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

      {/* Mobile: stacked rows */}
      <div className="flex flex-col items-center gap-3 md:hidden">
        {/* Row 1: 3 cards stacked */}
        <div className="relative" style={{ width: 190, height: 175 }}>
          {([
            { i: 0, x: 0,  rotate: -8, zIndex: 1 },
            { i: 1, x: 35, rotate: -3, zIndex: 2 },
            { i: 2, x: 70, rotate:  0, zIndex: 3 },
          ] as { i: number; x: number; rotate: number; zIndex: number }[]).map(({ i, x, rotate, zIndex }) => (
            <Card
              key={i}
              index={i}
              isSelected={selectedIndex === i}
              isLocked={isLocked && selectedIndex !== i}
              onClick={() => onSelect(i)}
              stackOffset={{ x, rotate, zIndex }}
            />
          ))}
        </div>

        {/* Row 2: 2 cards stacked */}
        <div className="relative" style={{ width: 155, height: 175 }}>
          {([
            { i: 3, x: 0,  rotate: -5, zIndex: 1 },
            { i: 4, x: 35, rotate:  0, zIndex: 2 },
          ] as { i: number; x: number; rotate: number; zIndex: number }[]).map(({ i, x, rotate, zIndex }) => (
            <Card
              key={i}
              index={i}
              isSelected={selectedIndex === i}
              isLocked={isLocked && selectedIndex !== i}
              onClick={() => onSelect(i)}
              stackOffset={{ x, rotate, zIndex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
