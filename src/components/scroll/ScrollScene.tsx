"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * `onRefresh` for every scrubbed ScrollTrigger. On reload the browser restores
 * the scroll position, but a scrubbed animation would sit at its start state
 * (e.g. a stage parked off screen, so the page looks blank) until the next
 * scroll. Whenever the trigger is (re)measured, jump its animation straight to
 * the current scroll position; scrubbing continues smoothly from there.
 */
export const jumpToScroll = (self: ScrollTrigger) => {
  self.animation?.progress(self.progress);
};

/** May return a cleanup, run when the scene's animations are reverted. */
export type SceneBuilder = (tl: gsap.core.Timeline, root: HTMLElement, opts: { reduced: boolean }) => void | (() => void);

type ScrollSceneProps = {
  /** Height of the tall scroll track, e.g. `h-[500vh]`. */
  trackClassName: string;
  /** Extra classes for the sticky stage (background, layout). */
  stageClassName?: string;
  /** ScrollTrigger scrub smoothing in seconds (lower = snappier). */
  scrub?: number;
  /** Adds tweens to the scrubbed timeline. Selectors are scoped to the scene. */
  build: SceneBuilder;
  label: string;
  id?: string;
  children: ReactNode;
};

/**
 * Tall track + `sticky top-0 h-screen` stage. The timeline is scrubbed across
 * the whole track (top top → bottom bottom); layout is never pinned by GSAP.
 */
export default function ScrollScene({
  trackClassName,
  stageClassName = "",
  scrub = 1,
  build,
  label,
  id,
  children,
}: ScrollSceneProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub,
            onRefresh: jumpToScroll,
          },
        });
        return build(tl, el, { reduced: false });
      });

      // Reduced motion: jump straight to each scene's settled end state.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const tl = gsap.timeline({ paused: true });
        const cleanup = build(tl, el, { reduced: true });
        tl.progress(1);
        return cleanup;
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} aria-label={label} className={`relative ${trackClassName}`}>
      <div
        className={`scene-units sticky top-0 grid h-screen grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden ${stageClassName}`}
      >
        {children}
      </div>
    </section>
  );
}

/** Classes that place a layer in the stage's single shared grid cell. */
export const LAYER = "col-start-1 row-start-1";

/** A layer sized to the 1920×980 Figma frame, centred in the stage. */
export const FRAME = `${LAYER} relative h-980 w-1920 place-self-center max-lg:h-full max-lg:w-full`;
