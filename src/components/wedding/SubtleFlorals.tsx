"use client";

import { useMemo } from "react";

const PETAL_COLORS = [
  "rgba(26,122,98,0.22)",
  "rgba(201,169,98,0.28)",
  "rgba(74,44,106,0.16)",
  "rgba(212,175,55,0.2)",
];

export function SubtleFlorals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 4) % 100}%`,
        delay: `${(i * 0.7) % 5}s`,
        duration: `${9 + (i % 5) * 2}s`,
        size: 6 + (i % 4) * 2,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
      })),
    [],
  );

  return (
    <div className="subtle-florals pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="floral-petal absolute top-0 rounded-full"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size * 1.4,
            background: petal.color,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
          }}
        />
      ))}
    </div>
  );
}
