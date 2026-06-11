"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COPY, OPENER_VIDEO } from "@/lib/constants";
import {
  preloadHeroBackground,
  preloadOpenerPoster,
  preloadOpenerVideo,
  preloadWeddingAudio,
  prefetchHeroImage,
  preloadGalleryImages,
} from "@/lib/prefetchAssets";
import { fireOpenerConfetti } from "@/lib/openerConfetti";

type VideoOpenerProps = {
  onReveal: () => void;
  onFinish?: () => void;
  onOpenStart?: () => void;
  onVideoPlaying?: () => void;
};

type Phase = "idle" | "playing" | "exit";

const REVEAL_LEAD_SECONDS = 0.35;
const EXIT_MS = 520;
const PLAY_START_TIMEOUT_MS = 6000;
const MAX_FALLBACK_MS = 32000;
const CONFETTI_LEAD_SECONDS = 0.35;
const READY_FALLBACK_MS = 1800;

function getBufferedProgress(video: HTMLVideoElement) {
  if (!Number.isFinite(video.duration) || video.duration <= 0) return 0;
  if (video.buffered.length === 0) return 0;
  return Math.min(1, video.buffered.end(video.buffered.length - 1) / video.duration);
}

export function VideoOpener({
  onReveal,
  onFinish,
  onOpenStart,
  onVideoPlaying,
}: VideoOpenerProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ready, setReady] = useState(false);
  const [posterVisible, setPosterVisible] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const finishedRef = useRef(false);
  const playingRef = useRef(false);
  const [hasFirstFrame, setHasFirstFrame] = useState(false);
  const confettiFiredRef = useRef(false);
  const playStartTimerRef = useRef<number | null>(null);
  const maxPlayTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (playStartTimerRef.current !== null) {
      window.clearTimeout(playStartTimerRef.current);
      playStartTimerRef.current = null;
    }
    if (maxPlayTimerRef.current !== null) {
      window.clearTimeout(maxPlayTimerRef.current);
      maxPlayTimerRef.current = null;
    }
  }, []);

  const hidePoster = useCallback(() => {
    if (!posterVisible) return;
    setPosterVisible(false);
  }, [posterVisible]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    void preloadOpenerPoster();
    void preloadOpenerVideo();
    void preloadHeroBackground();
    void preloadWeddingAudio();
    void preloadGalleryImages();
    prefetchHeroImage();

    const video = videoRef.current;
    if (video) {
      video.load();
    }

    return () => {
      document.body.style.overflow = "";
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => {
      setReady(true);
      setLoadProgress(1);
    };

    const markPlayable = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        markReady();
      }
    };

    const updateProgress = () => {
      setLoadProgress((current) => Math.max(current, getBufferedProgress(video)));
    };

    const timeout = window.setTimeout(markReady, READY_FALLBACK_MS);

    video.addEventListener("canplaythrough", markReady, { once: true });
    video.addEventListener("canplay", markPlayable, { once: true });
    video.addEventListener("loadeddata", () => {
      updateProgress();
      markPlayable();
    });
    video.addEventListener("progress", updateProgress);

    if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      markReady();
    } else {
      updateProgress();
    }

    return () => {
      window.clearTimeout(timeout);
      video.removeEventListener("loadeddata", updateProgress);
      video.removeEventListener("progress", updateProgress);
    };
  }, []);

  const triggerConfetti = useCallback(() => {
    if (confettiFiredRef.current) return;
    confettiFiredRef.current = true;
    fireOpenerConfetti();
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearTimers();
    if (!confettiFiredRef.current) {
      triggerConfetti();
    }

    const video = videoRef.current;
    if (video) {
      video.pause();
    }

    setPhase("exit");
    onReveal();
    onFinish?.();

    window.setTimeout(() => {
      document.body.style.overflow = "";
    }, EXIT_MS);
  }, [clearTimers, onFinish, onReveal, triggerConfetti]);

  const scheduleMaxPlayTimeout = useCallback(() => {
    const video = videoRef.current;
    const durationMs =
      video && Number.isFinite(video.duration) && video.duration > 0
        ? video.duration * 1000 + 1500
        : MAX_FALLBACK_MS;

    if (maxPlayTimerRef.current !== null) {
      window.clearTimeout(maxPlayTimerRef.current);
    }

    maxPlayTimerRef.current = window.setTimeout(() => {
      finish();
    }, durationMs);
  }, [finish]);

  const handlePlaying = useCallback(() => {
    playingRef.current = true;
    setHasFirstFrame(true);
    setBuffering(false);
    hidePoster();
    onVideoPlaying?.();

    if (playStartTimerRef.current !== null) {
      window.clearTimeout(playStartTimerRef.current);
      playStartTimerRef.current = null;
    }

    scheduleMaxPlayTimeout();
  }, [hidePoster, onVideoPlaying, scheduleMaxPlayTimeout]);

  const handleWaiting = useCallback(() => {
    if (phase === "playing" && !hasFirstFrame) {
      setBuffering(true);
    }
  }, [hasFirstFrame, phase]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || finishedRef.current) return;

    if (video.currentTime > 0.03) {
      setHasFirstFrame(true);
      hidePoster();
      setBuffering(false);
    }

    if (!Number.isFinite(video.duration) || video.duration <= 0) return;

    const remaining = video.duration - video.currentTime;

    if (remaining <= CONFETTI_LEAD_SECONDS) {
      triggerConfetti();
    }

    if (remaining <= REVEAL_LEAD_SECONDS) {
      finish();
    }
  }, [finish, hidePoster, triggerConfetti]);

  const open = useCallback(() => {
    if (startedRef.current || !ready) return;
    startedRef.current = true;
    onOpenStart?.();
    onVideoPlaying?.();
    setPhase("playing");

    const video = videoRef.current;
    if (!video) {
      finish();
      return;
    }

    const canStartImmediately = video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
    setBuffering(!canStartImmediately);

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");
    video.currentTime = 0;

    playStartTimerRef.current = window.setTimeout(() => {
      if (!playingRef.current) {
        finish();
      }
    }, PLAY_START_TIMEOUT_MS);

    const playAttempt = video.play();
    if (playAttempt !== undefined) {
      playAttempt.catch(() => {
        video.load();
        const retry = video.play();
        if (retry !== undefined) {
          retry.catch(() => finish());
        } else {
          finish();
        }
      });
    }
  }, [finish, onOpenStart, onVideoPlaying, ready]);

  const showInstructions =
    phase === "idle" || (phase === "playing" && buffering && !hasFirstFrame);

  const instructionText =
    phase === "playing" && buffering
      ? COPY.openerOpening
      : ready
        ? COPY.openerTap
        : COPY.openerPreparing;

  return (
    <div
      className={`video-opener fixed inset-0 z-[250] ${
        phase === "exit" ? "video-opener--exiting pointer-events-none" : ""
      }`}
      onClick={() => {
        if (phase === "idle" && ready) {
          open();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Ouvrir l'invitation de mariage"
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && phase === "idle" && ready) {
          event.preventDefault();
          open();
        }
      }}
    >
      <video
        ref={videoRef}
        className="video-opener__media absolute inset-0 h-full w-full object-cover"
        src={OPENER_VIDEO.src}
        poster={OPENER_VIDEO.poster}
        playsInline
        muted
        preload="auto"
        disablePictureInPicture
        onPlaying={handlePlaying}
        onWaiting={handleWaiting}
        onTimeUpdate={handleTimeUpdate}
        onEnded={finish}
        onError={() => finish()}
      />

      <img
        src={OPENER_VIDEO.poster}
        alt=""
        className={`video-opener__poster pointer-events-none absolute inset-0 z-[5] h-full w-full object-cover ${
          posterVisible ? "video-opener__poster--visible" : ""
        }`}
        aria-hidden="true"
      />

      {!ready ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto h-0.5 max-w-xs overflow-hidden rounded-full bg-white/15">
            <div
              className="video-opener__progress h-full rounded-full bg-gradient-to-r from-champagne-light via-gold to-champagne-light transition-[width] duration-300 ease-out"
              style={{ width: `${Math.max(8, Math.round(loadProgress * 100))}%` }}
            />
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {showInstructions ? (
          <motion.div
            key="opener-instructions"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/70 via-black/35 to-transparent px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-20 md:px-8 md:pt-8 md:pb-24"
          >
            <div className="mx-auto flex max-w-lg flex-col items-center text-center">
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="font-[family-name:var(--font-display)] text-[2rem] leading-none text-white/95 italic md:text-[2.35rem]"
              >
                {COPY.openerInvited}
              </motion.p>

              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="opener-instruction-line mt-3 h-px w-16 origin-center bg-gradient-to-r from-transparent via-gold to-transparent md:w-20"
                aria-hidden="true"
              />

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.38 }}
                className="opener-instruction-pill mt-4 rounded-full border border-white/30 bg-white/12 px-5 py-2.5 font-[family-name:var(--font-sans)] text-[11px] font-semibold tracking-[0.18em] text-white uppercase shadow-[0_8px_28px_rgba(0,0,0,0.22)] backdrop-blur-md md:text-xs md:tracking-[0.22em]"
              >
                {instructionText}
              </motion.p>

              {phase === "idle" && ready ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65, duration: 0.45 }}
                  className="mt-4 flex flex-col items-center gap-2"
                  aria-hidden="true"
                >
                  <span className="relative flex h-10 w-10 items-center justify-center">
                    <motion.span
                      className="absolute inset-0 rounded-full border border-white/35"
                      animate={{ scale: [1, 1.45, 1], opacity: [0.55, 0, 0.55] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.span
                      className="h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_12px_rgba(212,175,55,0.65)]"
                      animate={{ scale: [1, 0.92, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </span>
                  <span className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.18em] text-white/75 uppercase">
                    {COPY.openerTapAnywhere}
                  </span>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <span className="sr-only">
        {ready ? COPY.openerTap : COPY.openerPreparing}
      </span>
    </div>
  );
}
