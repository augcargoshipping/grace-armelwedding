"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_IMAGES } from "@/lib/constants";
import { useGalleryPreload } from "@/hooks/useGalleryPreload";

const AUTO_INTERVAL_MS = 5500;
const AUTO_DURATION = 0.72;
const MANUAL_DURATION = 0.28;
const SWIPE_OFFSET = 48;
const SWIPE_VELOCITY = 380;
const slideEase = [0.22, 1, 0.36, 1] as const;
const fastEase = [0.4, 0, 0.2, 1] as const;

type GallerySlideshowProps = {
  active: boolean;
  revealed: boolean;
};

type GallerySlideProps = {
  index: number;
  zIndex: number;
  duration: number;
  ease: readonly [number, number, number, number];
  fadeIn?: boolean;
  labelActive?: boolean;
  onFadeInComplete?: () => void;
};

function GallerySlide({
  index,
  zIndex,
  duration,
  ease,
  fadeIn = false,
  labelActive = false,
  onFadeInComplete,
}: GallerySlideProps) {
  const image = GALLERY_IMAGES[index];

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: fadeIn ? 0 : 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease }}
      style={{ zIndex }}
      aria-hidden={!labelActive}
      onAnimationComplete={() => {
        if (fadeIn) onFadeInComplete?.();
      }}
    >
      <img
        src={image.src}
        alt={labelActive ? image.alt : ""}
        decoding="async"
        loading="eager"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(28,26,24,0.32)] via-transparent to-transparent"
        aria-hidden="true"
      />
    </motion.div>
  );
}

export function GallerySlideshow({ active, revealed }: GallerySlideshowProps) {
  const pauseUntilRef = useRef(0);
  const transitioningRef = useRef(false);
  const reduceMotion = useReducedMotion();

  const [baseIndex, setBaseIndex] = useState(0);
  const [overlayIndex, setOverlayIndex] = useState<number | null>(null);
  const [fastTransition, setFastTransition] = useState(false);
  const [bootReady, setBootReady] = useState(false);

  const frontIndex = overlayIndex ?? baseIndex;
  const { ensureReady } = useGalleryPreload(revealed, frontIndex);

  useEffect(() => {
    if (!revealed) return;
    let cancelled = false;

    void ensureReady(0).then(() => {
      if (!cancelled) setBootReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [ensureReady, revealed]);

  const transitionDuration = reduceMotion ? 0 : fastTransition ? MANUAL_DURATION : AUTO_DURATION;
  const transitionEase = fastTransition ? fastEase : slideEase;

  const pauseAuto = useCallback(() => {
    pauseUntilRef.current = Date.now() + AUTO_INTERVAL_MS * 1.5;
  }, []);

  const commitOverlay = useCallback(() => {
    if (overlayIndex === null) return;
    setBaseIndex(overlayIndex);
    setOverlayIndex(null);
    transitioningRef.current = false;
  }, [overlayIndex]);

  const goTo = useCallback(
    async (next: number, manual = false) => {
      if (next === frontIndex || transitioningRef.current) return;

      await ensureReady(next);
      if (next === frontIndex || transitioningRef.current) return;

      if (manual) {
        setFastTransition(true);
        pauseAuto();
        window.setTimeout(() => setFastTransition(false), MANUAL_DURATION * 1000 + 80);
      } else {
        setFastTransition(false);
      }

      if (reduceMotion) {
        setBaseIndex(next);
        setOverlayIndex(null);
        transitioningRef.current = false;
        return;
      }

      transitioningRef.current = true;
      setOverlayIndex(next);
    },
    [ensureReady, frontIndex, pauseAuto, reduceMotion],
  );

  const nextSlide = useCallback(
    (manual = false) => {
      void goTo((frontIndex + 1) % GALLERY_IMAGES.length, manual);
    },
    [frontIndex, goTo],
  );

  const prevSlide = useCallback(
    (manual = false) => {
      void goTo((frontIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length, manual);
    },
    [frontIndex, goTo],
  );

  useEffect(() => {
    if (!active || !bootReady) return;

    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current || transitioningRef.current) return;
      nextSlide(false);
    }, AUTO_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [active, bootReady, nextSlide]);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextSlide(true);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevSlide(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, nextSlide, prevSlide]);

  useEffect(() => {
    if (overlayIndex === null || !reduceMotion) return;
    commitOverlay();
  }, [commitOverlay, overlayIndex, reduceMotion]);

  return (
    <div className="gallery-slideshow-shell">
      <motion.div
        className="gallery-slideshow relative aspect-[4/5] cursor-grab overflow-hidden rounded-[1.25rem] border border-champagne/25 shadow-[0_20px_50px_rgba(28,26,24,0.1)] active:cursor-grabbing md:aspect-[16/10] md:rounded-[1.5rem]"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) {
            nextSlide(true);
          } else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) {
            prevSlide(true);
          }
        }}
      >
        {bootReady ? (
          overlayIndex !== null ? (
            <>
              <GallerySlide
                key={`base-${baseIndex}`}
                index={baseIndex}
                zIndex={1}
                duration={0}
                ease={slideEase}
              />
              <GallerySlide
                key={`overlay-${overlayIndex}`}
                index={overlayIndex}
                zIndex={2}
                duration={transitionDuration}
                ease={transitionEase}
                fadeIn
                labelActive
                onFadeInComplete={commitOverlay}
              />
            </>
          ) : (
            <GallerySlide
              key={`base-${baseIndex}`}
              index={baseIndex}
              zIndex={2}
              duration={0}
              ease={slideEase}
              labelActive
            />
          )
        ) : (
          <div className="absolute inset-0 z-[1] animate-pulse bg-gradient-to-br from-pearl-deep via-champagne/10 to-pearl-deep" />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-6 pb-5 pt-16 md:px-8 md:pb-6">
          <p className="font-[family-name:var(--font-playfair)] text-sm italic text-white/90 md:text-base">
            {GALLERY_IMAGES[frontIndex].alt}
          </p>
          <p className="mt-1 font-[family-name:var(--font-sans)] text-[10px] tracking-[0.16em] text-white/55 uppercase">
            {frontIndex + 1} / {GALLERY_IMAGES.length}
          </p>
        </div>
      </motion.div>

      <button
        type="button"
        onClick={() => prevSlide(true)}
        className="gallery-nav-btn absolute top-1/2 left-3 z-20 -translate-y-1/2 md:left-5"
        aria-label="Photo précédente"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </button>
      <button
        type="button"
        onClick={() => nextSlide(true)}
        className="gallery-nav-btn absolute top-1/2 right-3 z-20 -translate-y-1/2 md:right-5"
        aria-label="Photo suivante"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </button>

      <div className="gallery-thumb-row mt-5 hidden md:flex">
        {GALLERY_IMAGES.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => void goTo(i, true)}
            className={`gallery-thumb overflow-hidden rounded-md border transition-all ${
              i === frontIndex
                ? "gallery-thumb--active border-emerald/70 ring-2 ring-emerald/25"
                : "border-champagne/25 opacity-70 hover:opacity-100"
            }`}
            aria-label={`Aller à la photo ${i + 1}`}
            aria-current={i === frontIndex ? "true" : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt=""
              width={64}
              height={48}
              decoding="async"
              loading="eager"
              className="h-12 w-16 object-cover"
            />
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
        {GALLERY_IMAGES.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => void goTo(i, true)}
            className={`gallery-dot h-1 rounded-full transition-all ${
              i === frontIndex ? "gallery-dot--active w-8 bg-emerald" : "w-1.5 bg-champagne/45"
            }`}
            aria-label={`Aller à la photo ${i + 1}`}
          />
        ))}
      </div>

      <p className="mt-4 text-center font-[family-name:var(--font-sans)] text-[10px] font-medium tracking-[0.2em] text-ink-soft/70 uppercase md:text-[11px]">
        Glissez ou utilisez les flèches pour naviguer
      </p>
    </div>
  );
}
