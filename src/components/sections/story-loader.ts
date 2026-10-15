import { STORY_FRAMES } from "./story-frames";

/**
 * Shared loader for the product story's image sequence. The first call starts
 * every download; later calls get the same images, so whoever asks first (the
 * mobile pre-preloader or ProductStory) warms them for the other.
 */
let images: HTMLImageElement[] | null = null;
let ready: Promise<void> | null = null;
let loaded = 0;
const listeners = new Set<(progress: number) => void>();

export function storyImages(): HTMLImageElement[] {
  if (images) return images;
  const list = STORY_FRAMES.map(({ src }) => {
    const img = new window.Image();
    img.decoding = "async";
    img.src = src;
    return img;
  });
  images = list;
  // Count a frame once it has downloaded (a broken one still counts, so nothing waits forever).
  // Decoding is only requested, not awaited: browsers may defer it while the tab is hidden.
  ready = Promise.all(
    list.map(
      (img) =>
        new Promise<void>((resolve) => {
          const done = () => {
            loaded += 1;
            listeners.forEach((fn) => fn(loaded / list.length));
            img.decode().catch(() => {});
            resolve();
          };
          if (img.complete) done();
          else {
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
          }
        }),
    ),
  ).then(() => listeners.clear());
  return list;
}

/** Starts loading if needed; resolves once every frame is ready. `onProgress` gets 0..1. */
export function whenStoryLoaded(onProgress?: (progress: number) => void): Promise<void> {
  const list = storyImages();
  if (onProgress) {
    onProgress(loaded / list.length);
    if (loaded < list.length) listeners.add(onProgress);
  }
  return ready!;
}
