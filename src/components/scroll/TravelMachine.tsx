"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { jumpToScroll } from "./ScrollScene";
import { whenIntroDone } from "@/components/intro/intro";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Natural size of `machine.png`; the overlay box is laid out at this size and scaled. */
export const MACHINE_W = 624;
export const MACHINE_H = 1392;
export const MACHINE_SRC = "/images/vendiq/machine.png";

/** Bounding boxes in `machine.png` pixels (measured once from the asset). */
export const MACHINE_BODY_PNG = { x: 71, y: 79, w: 482, h: 1248 };

/**
 * The food machine the story ends on (a tight cutout of its last frame). It
 * shares the drinks machine's box: same body width, standing on the same floor.
 */
export const FOOD_SRC = "/images/vendiq/sequence-high-quality/last%20one.png";
export const FOOD_W = 468;
export const FOOD_H = 1180;
const FOOD_BOX_W = 482;
const FOOD_BOX_H = (FOOD_BOX_W * FOOD_H) / FOOD_W;
/** Food machine placement in box px. */
export const FOOD_BOX = { x: 71, y: 1328 - FOOD_BOX_H, w: FOOD_BOX_W, h: FOOD_BOX_H };

/** Top-left in viewport px + uniform scale of the 624px-wide overlay box. */
export type Pose = { x: number; y: number; s: number };

type PoseName = "hero" | "f01" | "last" | "industries";

/** Food machine image positioned inside a box laid out at MACHINE_W × MACHINE_H. */
export function FoodMachine({ alt = "", eager = false }: { alt?: string; eager?: boolean }) {
  return (
    <Image
      src={FOOD_SRC}
      alt={alt}
      width={FOOD_W}
      height={FOOD_H}
      unoptimized
      loading={eager ? "eager" : undefined}
      className="absolute h-auto max-w-none"
      style={{
        left: `${(FOOD_BOX.x / MACHINE_W) * 100}%`,
        top: `${(FOOD_BOX.y / MACHINE_H) * 100}%`,
        width: `${(FOOD_BOX.w / MACHINE_W) * 100}%`,
      }}
    />
  );
}

/**
 * One machine travels the whole page: hero → product sequence → industries.
 * Each scene writes only its own parameter; `apply()` derives the overlay's
 * pose and visibility from all of them, so update order never matters.
 */
const travel = {
  outer: null as HTMLElement | null,
  drinkEl: null as HTMLElement | null,
  foodEl: null as HTMLElement | null,
  dockEl: null as HTMLElement | null,
  poses: {} as Partial<Record<PoseName, () => Pose>>,
  reduced: false,
  /** Hero → f01 glide (0..1). */
  glide: 0,
  /** 0 while the overlay owns the machine, 1 once the canvas sequence does. */
  reveal: 0,
  /** Pull-back out of the last frame, driven by the product story (0..1). */
  zoom: 0,
  /** Pull-back crossfade from the last frame to the machine image (1 = done, overlay takes over). */
  mix: 0,
  /** Pull-back continued into the industries slot (0..1). */
  dock: 0,
  /** Industries' in-stage machine has taken over. */
  docked: false,
  /** Reduced motion: px the hero has scrolled. */
  lift: 0,
};

/** Share of the pull-back curve covered inside the product story. */
const ZOOM_SPLIT = 0.6;

/** Extra drop (screen px) of the drinks machine in the hero, scrolled away by the glide. */
const HERO_DROP = 30;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Linear move between two poses. */
const mixPose = (a: Pose, b: Pose, t: number): Pose => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), s: lerp(a.s, b.s, t) });

/**
 * Camera-style move: scale changes geometrically while the food machine's
 * centre glides linearly on screen.
 */
const cameraPose = (a: Pose, b: Pose, t: number): Pose => {
  const px = FOOD_BOX.x + FOOD_BOX.w / 2;
  const py = FOOD_BOX.y + FOOD_BOX.h / 2;
  const s = a.s * Math.pow(b.s / a.s, t);
  const sx = lerp(a.x + px * a.s, b.x + px * b.s, t);
  const sy = lerp(a.y + py * a.s, b.y + py * b.s, t);
  return { x: sx - px * s, y: sy - py * s, s };
};

/** Pose along the pull-back (t: 0 = matched to the last frame, 1 = industries slot). */
export function pullPose(t: number): Pose | null {
  const { last, industries } = travel.poses;
  if (!last || !industries) return null;
  return cameraPose(last(), industries(), t);
}

function currentPose(): Pose | null {
  const { hero, f01 } = travel.poses;
  if (travel.reduced) {
    if (!hero) return null;
    const p = hero();
    return { ...p, y: p.y - travel.lift };
  }
  if (travel.dock > 0) return pullPose(ZOOM_SPLIT + (1 - ZOOM_SPLIT) * travel.dock);
  if (travel.zoom > 0) return pullPose(ZOOM_SPLIT * travel.zoom);
  if (!hero || !f01) return null;
  return mixPose(hero(), f01(), travel.glide);
}

/** Pose the overlay would have for the story's current pull-back progress. */
export function storyPullPose(zoom: number) {
  return pullPose(ZOOM_SPLIT * zoom);
}

export function applyTravel() {
  const { outer, dockEl, drinkEl, foodEl } = travel;
  if (dockEl) gsap.set(dockEl, { autoAlpha: travel.reduced || travel.docked ? 1 : 0 });
  if (!outer) return;
  // Drinks machine up to the story, food machine from its last frame onwards.
  const food = !travel.reduced && (travel.zoom > 0 || travel.dock > 0);
  if (drinkEl) gsap.set(drinkEl, { autoAlpha: food ? 0 : 1 });
  if (foodEl) gsap.set(foodEl, { autoAlpha: food ? 1 : 0 });
  const pose = currentPose();
  if (!pose) return;
  // Hero sits the drinks machine 30 screen px lower; that offset closes as it glides into the story.
  if (drinkEl) gsap.set(drinkEl, { y: (HERO_DROP * (travel.reduced ? 1 : 1 - travel.glide)) / pose.s });
  // The story canvas owns the machine from reveal until its pull-back crossfade completes.
  const opacity = travel.reduced ? 1 : travel.docked ? 0 : travel.reveal < 1 || travel.mix >= 1 ? 1 : 0;
  gsap.set(outer, { x: pose.x, y: pose.y, scale: pose.s, autoAlpha: opacity });
}

type Params = Pick<typeof travel, "glide" | "reveal" | "zoom" | "mix" | "dock" | "docked">;

export function setTravel(next: Partial<Params>) {
  Object.assign(travel, next);
  applyTravel();
}

export function registerPose(name: PoseName, fn: () => Pose) {
  travel.poses[name] = fn;
  applyTravel();
  return () => {
    if (travel.poses[name] === fn) delete travel.poses[name];
  };
}

/** The in-stage copy that takes over once the machine has docked in Industries. */
export function registerDock(el: HTMLElement) {
  travel.dockEl = el;
  applyTravel();
  return () => {
    if (travel.dockEl === el) travel.dockEl = null;
  };
}

/** Pose of a box (in viewport px) that shows the machine at `width` px wide. */
export const poseFromBox = (x: number, y: number, width: number): Pose => ({ x, y, s: width / MACHINE_W });

/**
 * Rect of `el` relative to the sticky stage it lives in, i.e. its viewport
 * rect while that stage is stuck at the top of the screen.
 */
export function rectInStage(el: HTMLElement) {
  const stage = el.closest<HTMLElement>(".scene-units");
  const r = el.getBoundingClientRect();
  const s = stage?.getBoundingClientRect() ?? { left: 0, top: 0 };
  return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height };
}

export default function TravelMachine() {
  const outer = useRef<HTMLDivElement>(null);
  const drink = useRef<HTMLDivElement>(null);
  const food = useRef<HTMLDivElement>(null);

  useGSAP((_, contextSafe) => {
    const el = outer.current;
    if (!el) return;
    travel.outer = el;
    travel.drinkEl = drink.current;
    travel.foodEl = food.current;

    // Hero entrance plays once the preloader hands over, on the inner image only.
    const offIntro = whenIntroDone(
      contextSafe!((waited: boolean) => {
        gsap.fromTo(
          ".machine-drink",
          { autoAlpha: 0, yPercent: 72, clipPath: "inset(100% 0% 0% 0%)" },
          { autoAlpha: 1, yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "power3.out", delay: waited ? 0 : 1.4 },
        );
      }),
    );

    const story = document.querySelector<HTMLElement>("#product-story");
    const industries = document.querySelector<HTMLElement>("#industries");
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      travel.reduced = false;
      const glide = { v: 0 };
      const dock = { v: 0 };
      // Hero → first frame of the sequence while the story stage scrolls in.
      if (story) {
        gsap.fromTo(glide, { v: 0 }, {
          v: 1,
          ease: "none",
          onUpdate: () => setTravel({ glide: glide.v }),
          scrollTrigger: { trigger: story, start: "top bottom", end: "top top", scrub: 0.4, onRefresh: jumpToScroll },
        });
      }
      // Pull-back continues into the industries slot while that stage scrolls in.
      if (industries) {
        gsap.fromTo(dock, { v: 0 }, {
          v: 1,
          ease: "none",
          onUpdate: () => setTravel({ dock: dock.v }),
          scrollTrigger: { trigger: industries, start: "top bottom", end: "top top", scrub: 0.4, onRefresh: jumpToScroll },
        });
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      travel.reduced = true;
      // Machine simply scrolls away with the hero.
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          travel.lift = self.scroll();
          applyTravel();
        },
      });
      applyTravel();
    });

    const onRefresh = () => applyTravel();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    applyTravel();

    // Rendered after every scene, so all triggers exist now. On a reload the
    // browser has usually restored the scroll position already: re-measure so
    // each scrubbed scene jumps to it (`jumpToScroll`) instead of showing its
    // start state until the first scroll.
    const settle = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") settle();
    else window.addEventListener("load", settle, { once: true });

    return () => {
      offIntro();
      window.removeEventListener("load", settle);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      mm.revert();
      if (travel.outer === el) {
        travel.outer = null;
        travel.drinkEl = null;
        travel.foodEl = null;
      }
    };
  });

  return (
    <div
      ref={outer}
      aria-hidden
      data-travel="outer"
      className="pointer-events-none invisible fixed top-0 left-0 z-[5] origin-top-left"
      style={{ width: MACHINE_W, height: MACHINE_H }}
    >
      <div ref={drink} className="absolute inset-0">
        <Image
          src={MACHINE_SRC}
          alt=""
          width={MACHINE_W}
          height={MACHINE_H}
          priority
          sizes="(min-width: 1024px) 100vw, 200vw"
          className="machine-drink invisible h-full w-full"
        />
      </div>
      <div ref={food} className="invisible absolute inset-0">
        <FoodMachine eager />
      </div>
    </div>
  );
}
