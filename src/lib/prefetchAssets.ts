import { GALLERY_IMAGES, OPENER_VIDEO, WEDDING_AUDIO, WEDDING_IMAGES } from "./constants";

const prefetched = new Set<string>();
const loadedGallery = new Set<string>();
let heroBackgroundPromise: Promise<void> | null = null;
let openerVideoPromise: Promise<void> | null = null;
let weddingAudioPromise: Promise<void> | null = null;

function appendLink(rel: "prefetch" | "preload", href: string, as: string, high = false) {
  const key = `${rel}:${href}`;
  if (prefetched.has(key)) return;
  prefetched.add(key);

  if (document.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;

  const link = document.createElement("link");
  link.rel = rel;
  link.as = as;
  link.href = href;
  if (high) {
    link.setAttribute("fetchpriority", "high");
  }
  document.head.appendChild(link);
}

function appendPrefetch(href: string, as: string) {
  appendLink("prefetch", href, as);
}

function preloadImageSrc(src: string, high = false): Promise<void> {
  if (loadedGallery.has(src)) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    if (high) {
      img.fetchPriority = "high";
    }
    img.onload = () => {
      loadedGallery.add(src);
      resolve();
    };
    img.onerror = () => {
      resolve();
    };
    img.src = src;
  });
}

export function isGalleryImageCached(src: string): boolean {
  return loadedGallery.has(src);
}

export function preloadHeroBackground(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (heroBackgroundPromise) return heroBackgroundPromise;

  const src = WEDDING_IMAGES.hero;
  appendLink("preload", src, "image", true);

  heroBackgroundPromise = preloadImageSrc(src, true);
  return heroBackgroundPromise;
}

export function preloadOpenerPoster(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  appendLink("preload", OPENER_VIDEO.poster, "image", true);
  return preloadImageSrc(OPENER_VIDEO.poster, true);
}

export function preloadOpenerVideo(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (openerVideoPromise) return openerVideoPromise;

  appendLink("preload", OPENER_VIDEO.src, "video", true);

  openerVideoPromise = new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");
    video.src = OPENER_VIDEO.src;

    const finish = () => resolve();
    const timeout = window.setTimeout(finish, 8000);

    video.addEventListener(
      "canplaythrough",
      () => {
        window.clearTimeout(timeout);
        finish();
      },
      { once: true },
    );
    video.addEventListener(
      "canplay",
      () => {
        if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          window.clearTimeout(timeout);
          finish();
        }
      },
      { once: true },
    );
    video.addEventListener(
      "error",
      () => {
        window.clearTimeout(timeout);
        finish();
      },
      { once: true },
    );

    video.load();
  });

  return openerVideoPromise;
}

export function preloadWeddingAudio(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (weddingAudioPromise) return weddingAudioPromise;

  appendLink("preload", WEDDING_AUDIO.src, "fetch", true);

  weddingAudioPromise = new Promise((resolve) => {
    const audio = document.createElement("audio");
    audio.preload = "auto";
    audio.src = WEDDING_AUDIO.src;

    const finish = () => resolve();
    const timeout = window.setTimeout(finish, 8000);

    audio.addEventListener(
      "canplaythrough",
      () => {
        window.clearTimeout(timeout);
        finish();
      },
      { once: true },
    );
    audio.addEventListener(
      "canplay",
      () => {
        window.clearTimeout(timeout);
        finish();
      },
      { once: true },
    );
    audio.addEventListener(
      "error",
      () => {
        window.clearTimeout(timeout);
        finish();
      },
      { once: true },
    );

    audio.load();
  });

  return weddingAudioPromise;
}

export function prefetchHeroImage() {
  void preloadHeroBackground();
  if (typeof window === "undefined") return;
  void preloadImageSrc(WEDDING_IMAGES.heroPhoto, true);
}

export function prefetchOpenerPlaybackAssets() {
  void preloadHeroBackground();
  void preloadOpenerPoster();
  void preloadOpenerVideo();
  void preloadWeddingAudio();
}

export function prefetchGalleryImages() {
  if (typeof window === "undefined") return;

  GALLERY_IMAGES.forEach((image, index) => {
    appendLink("preload", image.src, "image", index < 8);
  });
}

export function preloadGalleryImages(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  return Promise.all(
    GALLERY_IMAGES.map((image, index) => preloadImageSrc(image.src, index < 8)),
  ).then(() => undefined);
}

export function preloadGalleryImage(index: number): Promise<void> {
  const src = GALLERY_IMAGES[index]?.src;
  if (!src) return Promise.resolve();
  return preloadImageSrc(src, index < 8);
}
