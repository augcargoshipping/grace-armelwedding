"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setVisible(value > 0.02);
  });

  if (!mounted) return null;

  return createPortal(
    <motion.div
      className="scroll-progress fixed top-0 right-0 left-0 z-[290] h-[3px] origin-left"
      style={{ scaleX }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      aria-hidden="true"
    />,
    document.body,
  );
}
