"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Music, VolumeX } from "lucide-react";
import { WEDDING_AUDIO } from "@/lib/constants";

export type WeddingMusicHandle = {
  prepare: () => void;
  play: () => void;
  pause: () => void;
};

type WeddingMusicProps = {
  controlVisible?: boolean;
};

export const WeddingMusic = forwardRef<WeddingMusicHandle, WeddingMusicProps>(function WeddingMusic(
  { controlVisible = false },
  ref,
) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playPendingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);
  const [showControl, setShowControl] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const prepare = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.src) {
      audio.src = WEDDING_AUDIO.src;
    }
    audio.preload = "auto";
    audio.load();
  }, []);

  useEffect(() => {
    prepare();
  }, [prepare]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !hasAudio || playPendingRef.current) return;

    if (!audio.paused) {
      setIsPlaying(true);
      return;
    }

    playPendingRef.current = true;
    setShowControl(true);
    prepare();
    audio.muted = false;

    const playPromise = audio.play();
    if (!playPromise) {
      playPendingRef.current = false;
      setIsPlaying(true);
      return;
    }

    playPromise
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
      .finally(() => {
        playPendingRef.current = false;
      });
  }, [hasAudio, prepare]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  useImperativeHandle(ref, () => ({ prepare, play, pause }), [prepare, play, pause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = () => setHasAudio(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      audio.currentTime = 0;
      void audio.play();
    };

    audio.addEventListener("error", handleError);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      pause();
      return;
    }
    play();
  };

  const button =
    hasAudio && (showControl || controlVisible) ? (
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Couper la musique" : "Activer la musique"}
        className="music-toggle fixed right-4 bottom-4 z-[310] flex h-10 w-10 items-center justify-center rounded-full md:right-5 md:bottom-5"
      >
        {isPlaying ? <VolumeX className="h-4 w-4" /> : <Music className="h-4 w-4 opacity-80" />}
      </button>
    ) : null;

  return (
    <>
      <audio ref={audioRef} src={WEDDING_AUDIO.src} preload="auto" playsInline />
      {mounted && button ? createPortal(button, document.body) : null}
    </>
  );
});
