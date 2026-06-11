"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY_IMAGES } from "@/lib/constants";

const loadedSrc = new Set<string>();
const listeners = new Map<string, Set<() => void>>();

function notify(src: string) {
  listeners.get(src)?.forEach((cb) => cb());
}

function preloadImage(src: string): Promise<void> {
  if (loadedSrc.has(src)) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      loadedSrc.add(src);
      notify(src);
      resolve();
    };
    img.onerror = () => {
      loadedSrc.add(src);
      notify(src);
      resolve();
    };
    img.src = src;
  });
}

export function isGalleryImageReady(index: number): boolean {
  return loadedSrc.has(GALLERY_IMAGES[index]?.src ?? "");
}

export function useGalleryPreload(revealed: boolean, currentIndex: number) {
  const [, bump] = useState(0);

  useEffect(() => {
    if (!revealed) return;

    const unsubs: Array<() => void> = [];

    GALLERY_IMAGES.forEach((image) => {
      if (loadedSrc.has(image.src)) return;

      const set = listeners.get(image.src) ?? new Set();
      const cb = () => bump((v) => v + 1);
      set.add(cb);
      listeners.set(image.src, set);
      unsubs.push(() => {
        set.delete(cb);
      });
    });

    GALLERY_IMAGES.forEach((image) => {
      void preloadImage(image.src);
    });

    return () => {
      unsubs.forEach((off) => off());
    };
  }, [revealed]);

  useEffect(() => {
    if (!revealed) return;

    const neighbors = [
      currentIndex,
      (currentIndex + 1) % GALLERY_IMAGES.length,
      (currentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length,
    ];

    neighbors.forEach((i) => {
      void preloadImage(GALLERY_IMAGES[i].src);
    });
  }, [revealed, currentIndex]);

  const ensureReady = useCallback(async (index: number) => {
    const src = GALLERY_IMAGES[index]?.src;
    if (!src) return;
    if (loadedSrc.has(src)) return;
    await preloadImage(src);
  }, []);

  return { ensureReady, isReady: isGalleryImageReady };
}

export function preloadGalleryImages(): void {
  if (typeof window === "undefined") return;

  GALLERY_IMAGES.forEach((image) => {
    void preloadImage(image.src);
  });
}
