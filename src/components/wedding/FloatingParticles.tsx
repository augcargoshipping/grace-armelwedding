"use client";

import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${8 + ((i * 17) % 84)}%`,
  delay: (i % 7) * 0.35,
  duration: 5 + (i % 5),
  size: 2 + (i % 3),
}));

export function FloatingParticles({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {PARTICLES.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-champagne/50"
          style={{
            left: particle.left,
            bottom: "-4%",
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -120, -260],
            opacity: [0, 0.8, 0],
            x: [0, (particle.id % 2 === 0 ? 12 : -12), 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
