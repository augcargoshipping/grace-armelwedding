import { WEDDING_IMAGES } from "./constants";

const HERO_PRELOAD = WEDDING_IMAGES.hero;

export function prefetchHeroImage() {
  if (typeof window === "undefined") return;
  const bg = new window.Image();
  bg.src = HERO_PRELOAD;
  const photo = new window.Image();
  photo.src = WEDDING_IMAGES.heroPhoto;
}
