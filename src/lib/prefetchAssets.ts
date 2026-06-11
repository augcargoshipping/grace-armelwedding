import { OPENER_VIDEO, WEDDING_AUDIO, WEDDING_IMAGES } from "./constants";

const prefetched = new Set<string>();
let heroBackgroundPromise: Promise<void> | null = null;

function appendLink(rel: "prefetch" | "preload", href: string, as: string) {
  const key = `${rel}:${href}`;
  if (prefetched.has(key)) return;
  prefetched.add(key);

  if (document.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;

  const link = document.createElement("link");
  link.rel = rel;
  link.as = as;
  link.href = href;
  if (rel === "preload" && as === "image") {
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

export function prefetchHeroImage() {
  preloadHeroBackground();
  if (typeof window === "undefined") return;
  const photo = new window.Image();
  photo.src = WEDDING_IMAGES.heroPhoto;
}

export function prefetchOpenerPlaybackAssets() {
  void preloadHeroBackground();
  appendPrefetch(OPENER_VIDEO.poster, "image");
  appendPrefetch(OPENER_VIDEO.src, "video");
  appendPrefetch(WEDDING_AUDIO.src, "audio");
}
