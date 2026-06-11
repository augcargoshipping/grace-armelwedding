import { GALLERY_IMAGES, OPENER_VIDEO, WEDDING_AUDIO, WEDDING_IMAGES } from "./constants";

const prefetched = new Set<string>();
let heroBackgroundPromise: Promise<void> | null = null;
let openerVideoPromise: Promise<void> | null = null;

function appendLink(rel: "prefetch" | "preload", href: string, as: string) {
  const key = `${rel}:${href}`;
  if (prefetched.has(key)) return;
  prefetched.add(key);

  if (document.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;

  const link = document.createElement("link");
  link.rel = rel;
  link.as = as;
  link.href = href;
  if (rel === "preload") {
    link.setAttribute("fetchpriority", "high");
  }
  document.head.appendChild(link);
}

function appendPrefetch(href: string, as: string) {
  appendLink("prefetch", href, as);
}

export function preloadHeroBackground(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (heroBackgroundPromise) return heroBackgroundPromise;

  const src = WEDDING_IMAGES.hero;
  appendLink("preload", src, "image");

  heroBackgroundPromise = new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

  return heroBackgroundPromise;
}

export function preloadOpenerPoster(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  appendLink("preload", OPENER_VIDEO.poster, "image");

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = "high";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = OPENER_VIDEO.poster;
  });
}

export function preloadOpenerVideo(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (openerVideoPromise) return openerVideoPromise;

  appendLink("preload", OPENER_VIDEO.src, "video");

  openerVideoPromise = new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");
    video.src = OPENER_VIDEO.src;

    const finish = () => resolve();
    const timeout = window.setTimeout(finish, 12000);

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
        if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
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

export function prefetchHeroImage() {
  void preloadHeroBackground();
  if (typeof window === "undefined") return;
  const photo = new window.Image();
  photo.src = WEDDING_IMAGES.heroPhoto;
}

export function prefetchOpenerPlaybackAssets() {
  void preloadHeroBackground();
  void preloadOpenerPoster();
  void preloadOpenerVideo();
  appendPrefetch(WEDDING_AUDIO.src, "audio");
}

export function prefetchGalleryImages() {
  if (typeof window === "undefined") return;

  GALLERY_IMAGES.forEach((image, index) => {
    window.setTimeout(() => appendPrefetch(image.src, "image"), index * 80);
  });
}
