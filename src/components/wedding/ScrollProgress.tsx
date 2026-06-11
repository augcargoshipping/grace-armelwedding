"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const opacity = useTransform(scrollYProgress, [0, 0.02, 0.04], [0, 0, 1]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      className="scroll-progress fixed top-0 right-0 left-0 z-[290] h-[3px] origin-left"
      style={{ scaleX, opacity }}
      aria-hidden="true"
    />,
    document.body,
  );
}
