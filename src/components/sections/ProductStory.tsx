"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import ScrollScene, { FRAME, LAYER, type SceneBuilder } from "@/components/scroll/ScrollScene";
import {
  FOOD_BOX,
  FOOD_SRC,
  MACHINE_BODY_PNG,
  registerPose,
  setTravel,
  storyPullPose,
  type Pose,
} from "@/components/scroll/TravelMachine";
import {
  FOOD_IN_LAST,
  MACHINE_BODY_F01,
  STORY_FRAMES,
  STORY_MARKS,
  fitStage,
  frameScale,
  frameToStage,
} from "./story-frames";

const LAST = STORY_FRAMES.length - 1;
/** Last-frame source px per overlay box px (the food machine is the same image in both). */
const LAST_PER_BOX = FOOD_IN_LAST.w / FOOD_BOX.w;

type Caption = { lead: string; sub: string; subFirst: boolean; subClassName?: string };

const CAPTIONS: Caption[] = [
  { lead: "Pay", sub: "Tap to", subFirst: true },
  { lead: "Grab", sub: "and go", subFirst: false },
  { lead: "Done", sub: "Automatic Checkout", subFirst: false, subClassName: "w-460" },
];

function StoryCaption({ lead, sub, subFirst, subClassName = "" }: Caption) {
  const subLine = (
    <p className={`font-condensed font-medium text-black uppercase fs-80 leading-[0.825] tracking-[-0.04em] ${subClassName}`}>
      {sub}
    </p>
  );
  return (
    <div data-a="caption" className={`${LAYER} invisible flex flex-col justify-center gap-12`}>
      {subFirst && subLine}
      <p className="flex items-center gap-7 font-sans font-bold text-brand capitalize fs-150 leading-none tracking-[-0.04em]">
        <Image src="/images/vendiq/logo-mark.png" alt="" width={112} height={85} className="h-52 w-auto" />
        {lead}
      </p>
      {!subFirst && subLine}
    </div>
  );
}

/**
 * Tap → Grab → Done. The hero machine glides onto the first frame, the canvas
 * takes over and the 36-frame sequence plays straight through, ending zoomed
 * out on the food machine; the camera pulls back out of that frame onto the
 * same machine image, which carries on into Industries.
 */
export default function ProductStory() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const machineImg = useRef<HTMLImageElement | null>(null);
  const state = useRef({ frame: 0, reveal: 0, zoom: 0, mix: 0 });

  const stageSize = useCallback(() => {
    const c = canvasRef.current;
    return { W: c?.clientWidth || window.innerWidth, H: c?.clientHeight || window.innerHeight };
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !canvas.clientWidth) return;

    const { W, H } = stageSize();
    const dpr = canvas.width / W;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, W, H);

    const st = state.current;
    // Before the hand-off the overlay machine is the only one on screen; while
    // `reveal` rises the frame fades in underneath it (only the floor shadow shows).
    if (st.reveal <= 0 || st.mix >= 1) return;

    if (st.zoom > 0) {
      // Pull-back: the machine image sits under the shrinking last frame, both
      // on the overlay's camera, so the frame's edges never reveal white.
      const img = images.current[LAST];
      const pose = storyPullPose(st.zoom);
      if (!pose || !img?.complete || !img.naturalWidth) return;
      const qx = pose.x + FOOD_BOX.x * pose.s;
      const qy = pose.y + FOOD_BOX.y * pose.s;
      const png = machineImg.current;
      if (png?.complete && png.naturalWidth) {
        ctx.drawImage(png, qx, qy, FOOD_BOX.w * pose.s, FOOD_BOX.h * pose.s);
      }
      const k = pose.s / LAST_PER_BOX;
      const frame = STORY_FRAMES[LAST];
      ctx.globalAlpha = 1 - st.mix;
      ctx.drawImage(img, qx - FOOD_IN_LAST.x * k, qy - FOOD_IN_LAST.y * k, frame.srcW * k, frame.srcH * k);
      ctx.globalAlpha = 1;
      return;
    }

    const f = Math.min(Math.max(st.frame, 0), LAST);
    const i = Math.floor(f);
    const next = Math.min(i + 1, LAST);
    const t = f - i;
    const a = STORY_FRAMES[i];
    const b = STORY_FRAMES[next];
    const img = images.current[t > 0.5 && images.current[next]?.complete ? next : i];
    if (!img?.complete || !img.naturalWidth) return;

    const { desktop, s, ox, oy } = fitStage(W, H);
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    const w = a.w + (b.w - a.w) * t;
    const h = a.h + (b.h - a.h) * t;
    const clip = desktop ? a.clip + (b.clip - a.clip) * t : 0;

    ctx.save();
    ctx.globalAlpha = st.reveal;
    const clipX = ox + clip * s;
    ctx.beginPath();
    ctx.rect(clipX, 0, W - clipX, H);
    ctx.clip();
    ctx.drawImage(img, ox + x * s, oy + y * s, w * s, h * s);
    ctx.restore();
  }, [stageSize]);

  /** Redraw the canvas and hand the shared params to the travelling machine. */
  const sync = useCallback(() => {
    const { reveal, zoom, mix } = state.current;
    render();
    setTravel({ reveal, zoom, mix });
  }, [render]);

  // Poses the travelling machine needs from this scene.
  useEffect(() => {
    const f01 = (): Pose => {
      const { W, H } = stageSize();
      const frame = STORY_FRAMES[0];
      const body = frameToStage(frame, MACHINE_BODY_F01.x, MACHINE_BODY_F01.y, W, H);
      const s = (MACHINE_BODY_F01.w * frameScale(frame, W, H)) / MACHINE_BODY_PNG.w;
      return { x: body.x - MACHINE_BODY_PNG.x * s, y: body.y - MACHINE_BODY_PNG.y * s, s };
    };
    const last = (): Pose => {
      const { W, H } = stageSize();
      const frame = STORY_FRAMES[LAST];
      const c = frameToStage(frame, FOOD_IN_LAST.x, FOOD_IN_LAST.y, W, H);
      const s = frameScale(frame, W, H) * LAST_PER_BOX;
      return { x: c.x - FOOD_BOX.x * s, y: c.y - FOOD_BOX.y * s, s };
    };
    const offF01 = registerPose("f01", f01);
    const offLast = registerPose("last", last);
    return () => {
      offF01();
      offLast();
    };
  }, [stageSize]);

  // Preload frames and keep the canvas backing store matched to its box.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ~60 MB of frames: start after `load` so they don't hold the preloader (it waits for `load`).
    const preload = () => {
      images.current = STORY_FRAMES.map(({ src }, idx) => {
        const img = new window.Image();
        img.decoding = "async";
        img.src = src;
        img.onload = () => {
          if (Math.round(state.current.frame) === idx || idx === 0 || idx === LAST) render();
        };
        return img;
      });
      machineImg.current = new window.Image();
      machineImg.current.src = FOOD_SRC;
    };
    if (document.readyState === "complete") preload();
    else window.addEventListener("load", preload, { once: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      render();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    return () => {
      window.removeEventListener("load", preload);
      ro.disconnect();
    };
  }, [render]);

  const build: SceneBuilder = (tl, _root, { reduced }) => {
    const st = state.current;
    const { tapped, grabbed, done } = STORY_MARKS;
    const capIn = { autoAlpha: 1, yPercent: 0, duration: 1.2, ease: "power2.out" };
    const capOut = { autoAlpha: 0, yPercent: -110, duration: 1, ease: "power2.in" };
    const cap = (n: number) => `[data-a='caption']:nth-child(${n})`;

    // Timeline units are frames: one frame per unit, no idle stretches.
    tl.fromTo(st, { reveal: 0 }, { reveal: 1, duration: 0.6, onUpdate: sync }, 0)
      .fromTo(st, { frame: 0 }, { frame: LAST, duration: LAST, onUpdate: sync }, 0)
      .fromTo(cap(1), { autoAlpha: 0, yPercent: 110 }, capIn, tapped - 2)
      .to(cap(1), capOut, tapped + 3)
      .fromTo(cap(2), { autoAlpha: 0, yPercent: 110 }, capIn, grabbed - 1.5)
      .to(cap(2), capOut, grabbed + 4)
      .fromTo(cap(3), { autoAlpha: 0, yPercent: 110 }, capIn, done - 1);

    if (reduced) return;

    // Pull back out of the last frame, crossfading it into the machine image;
    // once fully crossfaded the overlay takes over at the identical pose.
    tl.to(cap(3), capOut, LAST + 0.4)
      .fromTo(st, { zoom: 0 }, { zoom: 1, duration: 5, ease: "none", onUpdate: sync }, LAST + 0.6)
      .fromTo(st, { mix: 0 }, { mix: 1, duration: 1.6, ease: "power1.inOut", onUpdate: sync }, LAST + 0.6);
  };

  return (
    <ScrollScene
      id="product-story"
      label="How it works: tap, grab and go"
      trackClassName="h-[500vh]"
      stageClassName="bg-white"
      scrub={0.4}
      build={build}
    >
      <canvas ref={canvasRef} aria-hidden className={`${LAYER} h-full w-full`} />

      {/* Caption window (copy panel left of the frame clip) */}
      <div className={`${FRAME} pointer-events-none flex items-center pl-175 max-lg:items-end max-lg:pb-80`}>
        <div className="grid h-420 w-600 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden max-lg:rounded-2xl max-lg:bg-white/90 max-lg:px-40 max-lg:[--spacing:calc(100vw/1300)] max-lg:[--u:calc(100vw/1300)]">
          {CAPTIONS.map((c) => (
            <StoryCaption key={c.lead} {...c} />
          ))}
        </div>
      </div>

      <h2 className="sr-only">Tap to pay, grab and go, done.</h2>
    </ScrollScene>
  );
}
