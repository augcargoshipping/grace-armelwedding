const OPENER_CONFETTI = [
  "#d4af37",
  "#e8d5a3",
  "#c9a962",
  "#1a7a62",
  "#0f5e4c",
  "#4a2c6a",
  "#6b4d8a",
  "#faf9f7",
];

export function fireOpenerConfetti() {
  void import("canvas-confetti").then(({ default: confetti }) => {
    type ConfettiOpts = Parameters<typeof confetti>[0];

    const burst = (options: ConfettiOpts, delayMs = 0) => {
      window.setTimeout(() => {
        confetti({
          decay: 0.92,
          gravity: 0.65,
          ticks: 240,
          shapes: ["circle"],
          scalar: 0.78,
          drift: 0.2,
          disableForReducedMotion: true,
          ...options,
        });
      }, delayMs);
    };

    burst({
      particleCount: 36,
      spread: 64,
      startVelocity: 20,
      origin: { x: 0.5, y: 0.52 },
      colors: OPENER_CONFETTI,
    });

    burst(
      {
        particleCount: 22,
        angle: 62,
        spread: 50,
        startVelocity: 22,
        origin: { x: 0.12, y: 0.56 },
        colors: OPENER_CONFETTI,
      },
      120,
    );

    burst(
      {
        particleCount: 22,
        angle: 118,
        spread: 50,
        startVelocity: 22,
        origin: { x: 0.88, y: 0.56 },
        colors: OPENER_CONFETTI,
      },
      120,
    );

    burst(
      {
        particleCount: 26,
        spread: 86,
        startVelocity: 14,
        origin: { x: 0.5, y: 0.44 },
        colors: OPENER_CONFETTI,
      },
      280,
    );
  });
}
