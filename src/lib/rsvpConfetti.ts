const CONFETTI_COLORS = [
  "#0f5e4c",
  "#1a7a62",
  "#2d9b7a",
  "#d4af37",
  "#c9a962",
  "#e8d5a3",
  "#f5efd6",
];

type ConfettiShape = "circle" | "square" | "star";

export function fireRsvpConfetti() {
  void import("canvas-confetti").then(({ default: confetti }) => {
    type ConfettiOptions = Parameters<typeof confetti>[0];

    const base: ConfettiOptions = {
      colors: CONFETTI_COLORS,
      shapes: ["circle", "square", "star"] as ConfettiShape[],
      ticks: 220,
      gravity: 0.82,
      decay: 0.9,
      scalar: 1.08,
      disableForReducedMotion: true,
    };

    confetti({
      ...base,
      particleCount: 110,
      spread: 78,
      startVelocity: 46,
      origin: { x: 0.5, y: 0.58 },
    });

    const sideBurst = (originX: number, angle: number) => {
      confetti({
        ...base,
        particleCount: 58,
        angle,
        spread: 58,
        startVelocity: 50,
        origin: { x: originX, y: 0.62 },
      });
    };

    sideBurst(0.1, 62);
    sideBurst(0.9, 118);

    window.setTimeout(() => {
      confetti({
        ...base,
        particleCount: 70,
        spread: 120,
        startVelocity: 34,
        origin: { x: 0.5, y: 0.42 },
      });
    }, 180);

    let bursts = 0;
    const interval = window.setInterval(() => {
      confetti({
        colors: CONFETTI_COLORS,
        shapes: ["circle", "star"],
        particleCount: 10,
        spread: 90,
        startVelocity: 24,
        ticks: 150,
        gravity: 0.9,
        origin: { x: Math.random(), y: Math.random() * 0.3 + 0.12 },
      });
      bursts += 1;
      if (bursts >= 10) window.clearInterval(interval);
    }, 130);
  });
}
