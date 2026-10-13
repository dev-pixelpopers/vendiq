/**
 * Product story image sequence (Figma 466:593, Variant7 → Variant58), high
 * quality renders. Placement is in Figma frame pixels (1920×980): the frame is
 * drawn at `x, y` sized `w × h`, and `clip` hides everything left of that x
 * (white copy panel). Renders differ slightly in size, so each keeps its own
 * `srcW × srcH`.
 */
export type StoryFrame = { src: string; srcW: number; srcH: number; x: number; y: number; w: number; h: number; clip: number };

const DIR = "/images/vendiq/sequence-high-quality";

/** Where a 1920×1080 render was laid out in each phase (Figma px). */
type Slot = { x: number; y: number; w: number; clip: number };
const TAP: Slot = { x: 171, y: 5, w: 1742, clip: 0 };
const TAPPED: Slot = { x: 164, y: 5, w: 1756, clip: 0 };
const OPEN: Slot = { x: 352, y: 0, w: 1742, clip: 0 };
const REACH: Slot = { x: 352, y: 0, w: 1742, clip: 648 };
const HOLD: Slot = { x: 456, y: 0, w: 1742, clip: 648 };
const GRABBED: Slot = { x: 443, y: 0, w: 1756, clip: 648 };
const LEAVE: Slot = { x: 286, y: 0, w: 1742, clip: 648 };
const DONE: Slot = { x: 296, y: 0, w: 1742, clip: 648 };

const A = [2560, 1440] as const;
const B = [2752, 1536] as const;

/**
 * [slot, source size, optional exact placement]. Each render spans the slot's
 * width, centred on its 16:9 box; the two overrides were registered against
 * the previous renders so the framing doesn't jump.
 */
const ROWS: [Slot, readonly [number, number], { x: number; y: number; w: number }?][] = [
  [TAP, A], [TAP, A], [TAP, B], [TAP, B], [TAP, B], [TAP, B], [TAP, B], [TAP, A], [TAP, A], [TAP, A],
  [TAPPED, B, { x: 157, y: 5, w: 1770 }],
  [OPEN, B], [OPEN, B], [OPEN, A], [OPEN, A], [OPEN, A], [OPEN, B], [OPEN, B],
  [REACH, B], [REACH, B, { x: 330, y: -5, w: 1784 }],
  [HOLD, B], [HOLD, B], [GRABBED, B],
  [LEAVE, B], [DONE, B], [DONE, B], [DONE, B], [DONE, B], [DONE, B], [DONE, B], [DONE, [2752, 1547]],
  [DONE, B], [DONE, B],
  [DONE, [2752, 1620]], [DONE, [2752, 1620]], [DONE, [2752, 1505]],
];

export const STORY_FRAMES: StoryFrame[] = ROWS.map(([slot, [srcW, srcH], at], i) => {
  const w = at?.w ?? slot.w;
  const h = (w * srcH) / srcW;
  return {
    src: `${DIR}/${String(i + 1).padStart(2, "0")}.jpg`,
    srcW,
    srcH,
    x: at?.x ?? slot.x,
    y: at?.y ?? slot.y + ((slot.w * 1080) / 1920 - h) / 2,
    w,
    h,
    clip: slot.clip,
  };
});

/** Frame indices where each caption lands. */
export const STORY_MARKS = { tapped: 10, grabbed: 22, done: 32 } as const;

const STAGE_W = 1920;
const STAGE_H = 980;

/** Bounding boxes in source-image pixels (measured once from the assets). */
export const MACHINE_BODY_F01 = { x: 1054, y: 140, w: 452, h: 1178 };
/** `last one.png` sits unscaled at this spot in the last frame. */
export const FOOD_IN_LAST = { x: 1088, y: 199, w: 468, h: 1180 };

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
export const frameScale = (frame: StoryFrame, W: number, H: number) => (frame.w / frame.srcW) * fitStage(W, H).s;

/** Map a point in a frame's source image to stage px. */
export function frameToStage(frame: StoryFrame, px: number, py: number, W: number, H: number) {
  const { s, ox, oy } = fitStage(W, H);
  return {
    x: ox + (frame.x + (px * frame.w) / frame.srcW) * s,
    y: oy + (frame.y + (py * frame.h) / frame.srcH) * s,
  };
}
