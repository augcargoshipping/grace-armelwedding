"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY_IMAGES } from "@/lib/constants";
import {
  isGalleryImageCached,
  preloadGalleryImage,
  preloadGalleryImages,
} from "@/lib/prefetchAssets";

export function useGalleryPreload(enabled: boolean, currentIndex: number) {
  const [readyVersion, setReadyVersion] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    void preloadGalleryImages().then(() => {
      if (!cancelled) setReadyVersion((v) => v + 1);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const neighbors = [
      currentIndex,
      (currentIndex + 1) % GALLERY_IMAGES.length,
      (currentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length,
      (currentIndex + 2) % GALLERY_IMAGES.length,
    ];

    neighbors.forEach((index) => {
      void preloadGalleryImage(index).then(() => {
        setReadyVersion((v) => v + 1);
      });
    });
  }, [enabled, currentIndex]);

  const isReady = useCallback(
    (index: number) => {
      void readyVersion;
      return isGalleryImageCached(GALLERY_IMAGES[index]?.src ?? "");
    },
    [readyVersion],
  );

  const ensureReady = useCallback(async (index: number) => {
    if (isReady(index)) return;
    await preloadGalleryImage(index);
    setReadyVersion((v) => v + 1);
  }, [isReady]);

  const ensureAllReady = useCallback(async () => {
    await preloadGalleryImages();
    setReadyVersion((v) => v + 1);
  }, []);

  const allReady = GALLERY_IMAGES.every((image) => isGalleryImageCached(image.src));

  return { allReady, ensureAllReady, ensureReady, isReady };
}
