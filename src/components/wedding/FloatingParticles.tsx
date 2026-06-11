"use client";

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${10 + ((i * 23) % 80)}%`,
  delay: `${(i % 4) * 0.8}s`,
  duration: `${6 + (i % 3)}s`,
  size: 2 + (i % 2),
}));

export function FloatingParticles({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className="hero-particle absolute rounded-full bg-champagne/45"
          style={{
            left: particle.left,
            bottom: "-4%",
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}
