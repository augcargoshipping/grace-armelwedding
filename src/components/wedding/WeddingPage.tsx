"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { VideoOpener } from "./VideoOpener";
import { SectionNav } from "./SectionNav";
import { Hero } from "./Hero";
import { BibleVerse } from "./BibleVerse";
import { OurStory } from "./OurStory";
import { Venues } from "./Venues";
import { ImportantInfo } from "./ImportantInfo";
import { Footer } from "./Footer";
import { SectionDivider } from "./SectionDivider";
import { ScrollProgress } from "./ScrollProgress";
import { SubtleFlorals } from "./SubtleFlorals";
import { Gallery } from "./Gallery";
import {
  prefetchGalleryImages,
  prefetchHeroImage,
  prefetchOpenerPlaybackAssets,
  preloadOpenerPoster,
  preloadOpenerVideo,
} from "@/lib/prefetchAssets";
import { preloadGalleryImages } from "@/hooks/useGalleryPreload";
import { WeddingMusic, type WeddingMusicHandle } from "./WeddingMusic";

const ProgramTimeline = dynamic(
  () => import("./ProgramTimeline").then((m) => ({ default: m.ProgramTimeline })),
  { ssr: false },
);

const RSVP = dynamic(() => import("./RSVP").then((m) => ({ default: m.RSVP })), {
  ssr: false,
});

const INTRO_KEY = "grace-armel-intro-done";

export function WeddingPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const musicRef = useRef<WeddingMusicHandle>(null);

  useLayoutEffect(() => {
    prefetchHeroImage();
    void preloadOpenerPoster();
    void preloadOpenerVideo();
    if (sessionStorage.getItem(INTRO_KEY) === "1") {
      setIsRevealed(true);
      setIntroDone(true);
    }
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    prefetchOpenerPlaybackAssets();
  }, []);

  useEffect(() => {
    if (!introDone) return;

    window.scrollTo(0, 0);
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "auto";
    }
  }, [introDone]);

  useEffect(() => {
    if (!introDone) return;

    prefetchGalleryImages();
    preloadGalleryImages();
    musicRef.current?.play();

    const resumeOnGesture = () => {
      musicRef.current?.play();
    };

    window.addEventListener("pointerdown", resumeOnGesture, { once: true });
    window.addEventListener("keydown", resumeOnGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", resumeOnGesture);
      window.removeEventListener("keydown", resumeOnGesture);
    };
  }, [introDone]);

  const handleOpenStart = () => {
    prefetchOpenerPlaybackAssets();
    musicRef.current?.play();
  };

  return (
    <>
      <WeddingMusic ref={musicRef} controlVisible={introDone} />
      {introDone ? <ScrollProgress /> : null}
      <SectionNav visible={introDone} />
      {introDone ? <SubtleFlorals /> : null}

      {isRevealed ? (
        <motion.main
          className="wedding-main relative z-[2]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <Hero backgroundReady={isRevealed} contentReady={introDone} />

          {introDone ? (
            <>
              <BibleVerse />
              <SectionDivider variant="floral" />
              <OurStory />
              <SectionDivider variant="floral" />
              <ProgramTimeline />
              <SectionDivider variant="floral" />
              <Venues />
              <SectionDivider variant="floral" />
              <Gallery />
              <SectionDivider variant="floral" />
              <RSVP />
              <SectionDivider variant="floral" />
              <ImportantInfo />
              <Footer />
            </>
          ) : null}
        </motion.main>
      ) : null}

      {!introDone ? (
        <VideoOpener
          onOpenStart={handleOpenStart}
          onVideoPlaying={() => musicRef.current?.play()}
          onReveal={() => setIsRevealed(true)}
          onFinish={() => {
            sessionStorage.setItem(INTRO_KEY, "1");
            setIntroDone(true);
          }}
        />
      ) : null}
    </>
  );
}
