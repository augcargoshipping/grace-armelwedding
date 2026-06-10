"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { InvitationOpener } from "./InvitationOpener";
import { SectionNav } from "./SectionNav";
import { Hero } from "./Hero";
import { BibleVerse } from "./BibleVerse";
import { OurStory } from "./OurStory";
import { ProgramTimeline } from "./ProgramTimeline";
import { Venues } from "./Venues";
import { Gallery } from "./Gallery";
import { RSVP } from "./RSVP";
import { ImportantInfo } from "./ImportantInfo";
import { Footer } from "./Footer";
import { SectionDivider } from "./SectionDivider";
import { ScrollProgress } from "./ScrollProgress";
import { SubtleFlorals } from "./SubtleFlorals";
import { prefetchHeroImage } from "@/lib/prefetchAssets";
import { WeddingMusic, type WeddingMusicHandle } from "./WeddingMusic";

const INTRO_KEY = "grace-armel-intro-done";

export function WeddingPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [ready, setReady] = useState(false);
  const musicRef = useRef<WeddingMusicHandle>(null);

  useLayoutEffect(() => {
    prefetchHeroImage();
    if (sessionStorage.getItem(INTRO_KEY) === "1") {
      setIsRevealed(true);
      setIntroDone(true);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <>
      <WeddingMusic ref={musicRef} revealed={isRevealed} />
      <ScrollProgress />
      <SectionNav visible={introDone} />
      {introDone ? <SubtleFlorals /> : null}

      {isRevealed ? (
        <motion.main
          className="relative z-[2]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        >
          <Hero revealed={introDone} />
          <SectionDivider variant="floral" />
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
        </motion.main>
      ) : null}

      {!introDone ? (
        <InvitationOpener
          onOpenStart={() => musicRef.current?.play()}
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
