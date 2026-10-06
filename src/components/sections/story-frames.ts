/**
 * Product story image sequence (Figma 466:593, Variant7 → Variant58).
 * Placement is in Figma frame pixels (1920×980): `x` is where the 16:9 frame
 * is drawn, `clip` hides everything left of that x (white copy panel).
 */
export type StoryFrame = { src: string; x: number; y: number; w: number; clip: number };

const seq = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/images/vendiq/sequence/${prefix}${String(i + 1).padStart(2, "0")}.webp`);

const tap = seq("f", 10).map<StoryFrame>((src, i) =>
  i < 9 ? { src, x: 171, y: 5, w: 1742, clip: 0 } : { src, x: 164, y: 5, w: 1756, clip: 0 },
);

const GRAB_X = [352, 352, 352, 352, 352, 352, 352, 352, 456, 456, 456, 443];
const grab = seq("z", 12).map<StoryFrame>((src, i) => ({
  src,
  x: GRAB_X[i],
  y: 0,
  w: i === 11 ? 1756 : 1742,
  clip: i < 6 ? 0 : 648,
}));

const done = seq("d", 12).map<StoryFrame>((src, i) => ({ src, x: i === 0 ? 286 : 296, y: 0, w: 1742, clip: 648 }));

export const STORY_FRAMES: StoryFrame[] = [...tap, ...grab, ...done];

/** Frame indices where each caption lands. */
export const STORY_MARKS = { tapped: 9, grabbed: 21, done: STORY_FRAMES.length - 1 } as const;

/** Source size of every sequence image. */
export const SRC_W = 1920;
export const SRC_H = 1080;
/** Height every frame is drawn at, in Figma px. */
export const FRAME_H = 980;
const STAGE_W = 1920;
const STAGE_H = 980;

/** Bounding boxes in sequence-image pixels (measured once from the assets). */
export const MACHINE_BODY_F01 = { x: 791, y: 105, w: 338, h: 881 };
export const TERMINAL_D12 = { x: 752, y: 110, w: 430, h: 677 };

/**
 * Fit the 1920×980 composition into a W×H (CSS px) stage; on narrow screens
 * zoom in on the product.
 */
export function fitStage(W: number, H: number) {
  const desktop = W / H >= 1.25;
  const s = desktop ? Math.min(W / STAGE_W, H / STAGE_H) : (H / STAGE_H) * 0.72;
  const ox = desktop ? (W - STAGE_W * s) / 2 : W / 2 - 1180 * s;
  const oy = (H - STAGE_H * s) / 2;
  return { desktop, s, ox, oy };
}

/** Stage px per source-image px for a frame. */
export const frameScale = (frame: StoryFrame, W: number, H: number) => (frame.w / SRC_W) * fitStage(W, H).s;

/** Map a point in a frame's source image (1920×1080) to stage px. */
export function frameToStage(frame: StoryFrame, px: number, py: number, W: number, H: number) {
  const { s, ox, oy } = fitStage(W, H);
  return {
    x: ox + (frame.x + (px * frame.w) / SRC_W) * s,
    y: oy + (frame.y + (py * FRAME_H) / SRC_H) * s,
  };
}
