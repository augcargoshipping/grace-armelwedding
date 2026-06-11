"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COPY, GALLERY_IMAGES } from "@/lib/constants";

const AUTO_INTERVAL_MS = 6000;
const AUTO_DURATION = 0.9;
const MANUAL_DURATION = 0.32;
const SWIPE_OFFSET = 48;
const SWIPE_VELOCITY = 380;
const slideEase = [0.22, 1, 0.36, 1] as const;
const fastEase = [0.4, 0, 0.2, 1] as const;

function GalleryHeader({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="mb-10 text-center"
    >
      <h2 className="font-[family-name:var(--font-cormorant)] text-4xl text-ink md:text-5xl">
        {COPY.galleryTitle}
      </h2>
      <p className="mt-3 font-[family-name:var(--font-playfair)] text-lg italic text-ink-soft">
        {COPY.gallerySubtitle}
      </p>
      <div className="gold-line mx-auto my-6 w-24" />
    </motion.div>
  );
}

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const pauseUntilRef = useRef(0);
  const inView = useInView(sectionRef, { once: true, margin: "-8% 0px" });
  const isActive = useInView(sectionRef, { margin: "-20% 0px -20% 0px", amount: 0.2 });

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [fastTransition, setFastTransition] = useState(false);

  const pauseAuto = useCallback(() => {
    pauseUntilRef.current = Date.now() + AUTO_INTERVAL_MS * 1.5;
  }, []);

  const goTo = useCallback(
    (next: number, dir: number, manual = false) => {
      if (next === index) return;
      setDirection(dir);
      if (manual) {
        setFastTransition(true);
        pauseAuto();
        window.setTimeout(() => setFastTransition(false), MANUAL_DURATION * 1000 + 80);
      } else {
        setFastTransition(false);
      }
      setIndex(next);
    },
    [index, pauseAuto],
  );

  const nextSlide = useCallback(
    (manual = false) => {
      goTo((index + 1) % GALLERY_IMAGES.length, 1, manual);
    },
    [goTo, index],
  );

  const prevSlide = useCallback(
    (manual = false) => {
      goTo((index - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length, -1, manual);
    },
    [goTo, index],
  );

  useEffect(() => {
    if (!isActive) return;
    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      nextSlide(false);
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isActive, nextSlide]);

  const transitionDuration = fastTransition ? MANUAL_DURATION : AUTO_DURATION;
  const transitionEase = fastTransition ? fastEase : slideEase;

  return (
    <section id="galerie" ref={sectionRef} className="luxury-section bg-white/35">
      <div className="mx-auto max-w-6xl">
        <GalleryHeader inView={inView} />

        {/* Mobile slideshow */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1 }}
          className="relative md:hidden"
        >
          <motion.div
            className="gallery-slideshow relative aspect-[4/5] cursor-grab overflow-hidden rounded-[1.25rem] border border-champagne/25 bg-pearl-deep shadow-[0_20px_50px_rgba(28,26,24,0.1)] active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) {
                nextSlide(true);
              } else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) {
                prevSlide(true);
              }
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                className="absolute inset-0"
                initial={{
                  opacity: 0,
                  x: direction > 0 ? "18%" : "-18%",
                  scale: fastTransition ? 1 : 1.03,
                }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? "-18%" : "18%",
                  scale: fastTransition ? 1 : 1.02,
                }}
                transition={{ duration: transitionDuration, ease: transitionEase }}
              >
                <Image
                  src={GALLERY_IMAGES[index].src}
                  alt={GALLERY_IMAGES[index].alt}
                  fill
                  className="pointer-events-none object-cover select-none"
                  sizes="100vw"
                  quality={75}
                  priority={index === 0}
                  draggable={false}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(28,26,24,0.28)] via-transparent to-transparent"
                  aria-hidden="true"
                />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-6 pb-5 pt-16">
              <p className="font-[family-name:var(--font-playfair)] text-sm italic text-white/90">
                {GALLERY_IMAGES[index].alt}
              </p>
            </div>
          </motion.div>

          <button
            type="button"
            onClick={() => prevSlide(true)}
            className="gallery-nav-btn absolute top-1/2 left-3 z-20 -translate-y-1/2"
            aria-label="Photo précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => nextSlide(true)}
            className="gallery-nav-btn absolute top-1/2 right-3 z-20 -translate-y-1/2"
            aria-label="Photo suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="mt-6 flex items-center justify-center gap-2">
            {GALLERY_IMAGES.map((image, i) => (
              <button
                key={image.src}
                type="button"
                onClick={() => goTo(i, i > index ? 1 : -1, true)}
                className={`gallery-dot h-1 rounded-full transition-all ${
                  i === index ? "gallery-dot--active w-8 bg-emerald" : "w-1.5 bg-champagne/45"
                }`}
                aria-label={`Aller à la photo ${i + 1}`}
              />
            ))}
          </div>
          <p className="mt-4 text-center font-[family-name:var(--font-sans)] text-[10px] font-medium tracking-[0.2em] text-ink-soft/70 uppercase">
            Glissez pour naviguer
          </p>
        </motion.div>

        {/* Desktop grid */}
        <div className="gallery-grid hidden md:grid">
          {inView &&
            GALLERY_IMAGES.map((image, i) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.08, ease: slideEase }}
              className="gallery-grid-item group"
            >
              <div
                className={`gallery-frame relative w-full overflow-hidden ${
                  i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-[4/5]" : "aspect-square"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  quality={75}
                  loading="lazy"
                />
                <div className="gallery-grid-overlay pointer-events-none absolute inset-0 flex items-end p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <p className="font-[family-name:var(--font-playfair)] text-sm italic text-white">
                    {image.alt}
                  </p>
                </div>
              </div>
            </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
