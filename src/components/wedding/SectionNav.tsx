"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { COUPLE } from "@/lib/constants";

const SECTIONS = [
  { id: "accueil", label: "Accueil" },
  { id: "verset", label: "Verset" },
  { id: "histoire", label: "Histoire" },
  { id: "programme", label: "Programme" },
  { id: "lieux", label: "Lieux" },
  { id: "galerie", label: "Galerie" },
  { id: "rsvp", label: "RSVP" },
] as const;

const NAV_OFFSET = 80;

export function SectionNav({ visible }: { visible: boolean }) {
  const [active, setActive] = useState("accueil");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => setMounted(true), []);

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    setActive(id);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const sections = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const nextScrolled = window.scrollY > 120;
        if (nextScrolled !== scrolledRef.current) {
          scrolledRef.current = nextScrolled;
          setScrolled(nextScrolled);
        }
        if (window.scrollY < window.innerHeight * 0.5) {
          setActive("accueil");
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < window.innerHeight * 0.5) return;
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top?.target.id) setActive(top.target.id);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0.2, 0.45] },
    );

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    sections.forEach((el) => observer.observe(el!));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [visible]);

  if (!visible || !mounted) return null;

  return createPortal(
    <div className="section-nav-shell">
      <motion.nav
        className="section-nav"
        aria-label="Sections"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: scrolled ? 0 : -80, opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="mr-1 hidden shrink-0 border-r border-champagne/30 pr-2 font-[family-name:var(--font-cormorant)] text-sm font-semibold text-emerald sm:inline">
          {COUPLE.initials}
        </span>
        {SECTIONS.map((section) => (
          <motion.a
            key={section.id}
            href={`#${section.id}`}
            data-active={active === section.id}
            onClick={(event) => {
              event.preventDefault();
              scrollToSection(section.id);
            }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
          >
            {section.label}
          </motion.a>
        ))}
      </motion.nav>
    </div>,
    document.body,
  );
}
