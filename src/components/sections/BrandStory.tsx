"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollScene, { FRAME, LAYER, type SceneBuilder } from "@/components/scroll/ScrollScene";

const A = "/images/vendiq";

type Callout = {
  /** One entry per line, so the text box is exactly as wide as its longest line. */
  lines: string[];
  /** Figma offsets: left indent from the column edge, gap from previous item. */
  indent: string;
  gap: string;
  textWidth: string;
  /** Connector, in Figma px: how far it runs past the text towards the dot, and its top edge. */
  reach: number;
  top: number;
};

const LEFT: Callout[] = [
  { lines: ["Smarter Vending.", "Better Experience"], indent: "ml-99", gap: "", textWidth: "w-311", reach: 95, top: -19 },
  { lines: ["Built for Modern", "Workplaces"], indent: "ml-0", gap: "mt-110", textWidth: "w-352", reach: 74, top: -23 },
  { lines: ["Smart Inventory", "Tracking"], indent: "ml-93", gap: "mt-93", textWidth: "w-308", reach: 86, top: -18 },
];

const RIGHT: Callout[] = [
  { lines: ["HD Digital", "Display"], indent: "ml-0", gap: "", textWidth: "w-196", reach: 49, top: 1 },
  { lines: ["Digital Price", "Tags"], indent: "ml-55", gap: "mt-72", textWidth: "w-217", reach: 30, top: 0 },
  { lines: ["POS with Smart", "Lock"], indent: "ml-65", gap: "mt-82", textWidth: "w-278", reach: 47, top: 2 },
  { lines: ["Cellular, WiFi", "Included"], indent: "ml-25", gap: "mt-82", textWidth: "w-282", reach: 70, top: 0 },
];

/**
 * Connector drawn around the text box (was an SVG): a line from the dot along
 * the text, turning through a 30px corner and ending 20px past the text.
 * Left: along the top, turning down past the text's left edge.
 * Right: along the bottom, turning up past the text's right edge.
 */
const CONNECTOR = {
  left: "before:-left-20 before:right-[calc(var(--spacing)*var(--reach)*-1)] before:border-t before:border-l before:border-sun before:rounded-tl-[calc(var(--spacing)*30)]",
  right: "before:-right-20 before:left-[calc(var(--spacing)*var(--reach)*-1)] before:border-b before:border-r before:border-brand before:rounded-br-[calc(var(--spacing)*30)]",
};

function CalloutItem({ c, side }: { c: Callout; side: "left" | "right" }) {
  return (
    <li
      data-a={`callout-${side}`}
      className={`invisible flex ${c.indent} ${c.gap} ${c.textWidth} font-bold text-white capitalize fs-30 leading-[0.934] tracking-[-0.02em] ${side === "left" ? "justify-end text-right" : ""} max-lg:m-0 max-lg:w-auto max-lg:text-left max-lg:text-base`}
    >
      <span
        style={{ "--reach": c.reach, "--top": c.top } as CSSProperties}
        className={`relative w-max before:pointer-events-none before:absolute before:top-[calc(var(--spacing)*var(--top))] before:h-71 before:content-[''] ${CONNECTOR[side]} max-lg:w-auto max-lg:before:hidden`}
      >
        {c.lines.map((line, i) => (
          <span key={line} className="block max-lg:inline">
            {i > 0 && <span className="hidden max-lg:inline"> </span>}
            {line}
          </span>
        ))}
      </span>
    </li>
  );
}

function Eyebrow({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p className={`flex items-center gap-15 font-medium text-white uppercase tracking-[-0.02em] ${className}`}>
      <Image src={`${A}/logo-mark.png`} alt="" width={112} height={85} className="h-33 w-auto" />
      {children}
    </p>
  );
}

/**
 * Wordmark halves: the outline "vendIQ" (1567×408 Figma px, assembled at
 * 145,343) is cut at its midline into two 204px windows. Offsets below are
 * yPercent of a half's 204px height.
 */
const HALF = {
  /** Top half up to the top edge (343 → 12); also where the bottom half merges under it (547 → 216). */
  topParted: -162.25,
  /** Bottom half down to the bottom edge (547 → 869). */
  bottomParted: 157.8,
  /** Merged wordmark lifts 242px: top half leaves (→ -230), bottom half sits on the top edge (→ -26). */
  lifted: -280.9,
};

const WM_TOP = "[data-a='wordmark-top']";
const WM_BOTTOM = "[data-a='wordmark-bottom']";

/**
 * Mobile wordmark: fits the screen width and is centred vertically, so offsets
 * depend on the stage height. Parted, each half sits EDGE of the stage height in
 * from its edge; lifted, the bottom half sits on the top edge with LIFT_HIDE of
 * its height cut off (as on desktop).
 */
const EDGE = 0.03;
const LIFT_HIDE = 0.13;
const mobileWordmark = (fn: (h: number, H: number) => number) => (_: number, el: HTMLElement) =>
  fn(el.offsetHeight, el.parentElement?.offsetHeight ?? window.innerHeight);

/**
 * The track overlaps the last 200vh of Industries (`-mt-[200vh]`): once this
 * stage pins, it slides down from the top over the still-pinned Industries
 * stage during the first ~100vh. Keep ARRIVE ≈ 1/8 of the timeline so that
 * slide spans 100vh of the 800vh pinned range.
 */
const ARRIVE = 1.75;

/**
 * Figma 471:10924 → 479:13722.
 * The section slides in from the top, then the outline wordmark assembles from
 * two halves (top from the left, bottom from the right), parts to frame "Who
 * we are". On exit the text wipes away, the bottom half rises to re-join the
 * top half, and the merged wordmark lifts until only its bottom half shows on
 * the top edge; then the "why choose" diagram assembles around the pantry machine.
 */
const build: SceneBuilder = (tl, root, { reduced }) => {
  const stage = root.querySelector<HTMLElement>(":scope > .scene-units");
  if (stage) {
    // Before it pins, the stage sits in the overlap below the fold — keep it
    // hidden until the pin starts so it only ever enters from the top.
    const show = (on: boolean) => gsap.set(stage, { autoAlpha: on ? 1 : 0 });
    if (reduced) {
      show(true);
    } else {
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onEnter: () => show(true),
        onLeaveBack: () => show(false),
        onRefresh: (self) => show(self.scroll() > self.start),
      });
      tl.fromTo(stage, { yPercent: -100 }, { yPercent: 0, duration: ARRIVE, ease: "power2.out" }, 0);
    }
  }

  tl.addLabel("in", reduced ? 0 : ARRIVE)
    .fromTo("[data-a='wordmark-top']", { xPercent: -150 }, { xPercent: 0, duration: 1.4, ease: "power3.out" }, "in")
    .fromTo("[data-a='wordmark-bottom']", { xPercent: 150 }, { xPercent: 0, duration: 1.4, ease: "power3.out" }, "in")
    .addLabel("part", "+=0.4")
    .fromTo("[data-a='glow']", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, "part+=0.4")
    .fromTo(
      "[data-a='who-line']",
      { autoAlpha: 0, yPercent: 110 },
      { autoAlpha: 1, yPercent: 0, duration: 1, stagger: 0.25, ease: "power2.out" },
      "part+=0.8",
    )
    .to({}, { duration: 0.6 })
    .addLabel("exit")
    // Content clips away first (bottom edge wipes up to nothing)…
    .fromTo(
      "[data-a='who-line']",
      { clipPath: "inset(0% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, stagger: 0.08, ease: "power2.in" },
      "exit",
    )
    // …then the bottom half rises to meet the parked top half, re-forming the wordmark…
    .addLabel("merge", "exit+=1.2")
    // …and the merged wordmark lifts together until only the bottom half shows on the top edge.
    .addLabel("lift", "merge+=1.3")
    .addLabel("why", "lift+=0.6");

  const mm = gsap.matchMedia(root);
  const move = { duration: 1.2, ease: "power2.inOut" };
  const heading = (at: string) =>
    tl.fromTo("[data-a='why-heading']", { autoAlpha: 0, yPercent: -60 }, { autoAlpha: 1, yPercent: 0, duration: 0.8 }, at);
  const pantry = (at: string) =>
    tl.fromTo("[data-a='pantry']", { autoAlpha: 0, yPercent: 45 }, { autoAlpha: 1, yPercent: 0, duration: 1.4, ease: "power3.out" }, at);

  mm.add("(min-width: 64rem)", () => {
    tl.to(WM_TOP, { yPercent: HALF.topParted, ...move }, "part")
      .to(WM_BOTTOM, { yPercent: HALF.bottomParted, ...move }, "part")
      .to(WM_BOTTOM, { yPercent: HALF.topParted, ...move }, "merge")
      .to([WM_TOP, WM_BOTTOM], { yPercent: HALF.lifted, ...move, duration: 1 }, "lift");
    heading("why");
    pantry("why");

    // Arcs wipe outward from the machine: left arc right → left, right arc left → right.
    tl.fromTo(
      "[data-a='arc-left']",
      { autoAlpha: 1, clipPath: "inset(0% 0% 0% 100%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power2.inOut" },
      "why+=0.6",
    )
      .fromTo(
        "[data-a='arc-right']",
        { autoAlpha: 1, clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power2.inOut" },
        "why+=0.6",
      )
      .fromTo("[data-a='callout-left']", { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.25 }, "why+=1.4")
      .fromTo("[data-a='callout-right']", { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.25 }, "why+=1.5")
      .to({}, { duration: 1.2 });
  });

  // Mobile, no arcs: the first three sit left of the machine; then the machine
  // crosses to the left half and the other four take the right.
  mm.add("(width < 64rem)", () => {
    // The wordmark starts centred; offsets are px from there, measured from the stage height.
    tl.to(WM_TOP, { y: mobileWordmark((h, H) => EDGE * H - (H / 2 - h)), ...move }, "part")
      .to(WM_BOTTOM, { y: mobileWordmark((h, H) => H / 2 - EDGE * H - h), ...move }, "part")
      .to(WM_BOTTOM, { y: mobileWordmark((h, H) => EDGE * H + h - H / 2), ...move }, "merge")
      .to([WM_TOP, WM_BOTTOM], { y: mobileWordmark((h, H) => -LIFT_HIDE * h - H / 2), ...move, duration: 1 }, "lift");

    // No empty screen while the wordmark re-forms and lifts: the machine and the
    // first callouts come in as the bottom half starts rising; the heading waits
    // until the merged wordmark has lifted clear of its spot.
    pantry("merge");
    heading("lift+=0.2");
    tl.fromTo("[data-a='callout-left']", { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.25 }, "merge+=0.8")
      .addLabel("swap", "merge+=3")
      .to("[data-a='callout-left']", { autoAlpha: 0, x: -40, duration: 0.6, stagger: 0.1, ease: "power2.in" }, "swap")
      .fromTo("[data-a='pantry-slot']", { xPercent: 0 }, { xPercent: -100, duration: 1.2, ease: "power2.inOut" }, "swap+=0.3")
      .fromTo("[data-a='callout-right']", { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.25 }, "swap+=1.1")
      // Longer final hold keeps the timeline about as long as before, so the
      // section's slide-in (ARRIVE) still spans roughly the same scroll.
      .to({}, { duration: 2.9 });
  });

  return () => mm.revert();
};

export default function BrandStory() {
  return (
    <ScrollScene
      id="about"
      label="About VendIQ"
      trackClassName="-mt-[200vh] h-[900vh]"
      stageClassName="invisible bg-ember-linear"
      invalidateOnRefresh
      build={build}
    >
      {/* Warm glows (decorative) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image data-a="glow" src={`${A}/glow-sun.svg`} alt="" width={2526} height={2526} className="invisible absolute top-[-74%] left-[0.2%] w-[132%] max-w-none" />
        <Image data-a="glow" src={`${A}/glow-orange.svg`} alt="" width={2526} height={2526} className="invisible absolute top-[-84%] left-[-21%] w-[132%] max-w-none" />
      </div>

      {/* Outline wordmark, split at its midline into two halves (decorative) */}
      <div aria-hidden className={`${FRAME} pointer-events-none`}>
        {/* Mobile: scaled to 920 units wide (204 → 119.75 tall per half), centred vertically */}
        <div
          data-a="wordmark-top"
          className="absolute top-343 left-145 h-204 w-1567 overflow-hidden max-lg:top-[calc(50%-var(--spacing)*119.75)] max-lg:left-40 max-lg:h-119.75 max-lg:w-920"
        >
          <Image src={`${A}/outline-wordmark-top.svg`} alt="" width={1567} height={409} className="h-408.5 w-1567 max-w-none max-lg:h-239.75 max-lg:w-920" />
        </div>
        <div
          data-a="wordmark-bottom"
          className="absolute top-547 left-145 h-204 w-1567 overflow-hidden max-lg:top-1/2 max-lg:left-40 max-lg:h-119.75 max-lg:w-920"
        >
          <Image src={`${A}/outline-wordmark-bottom.svg`} alt="" width={1567} height={408} className="-mt-204 h-408 w-1567 max-w-none max-lg:-mt-119.75 max-lg:h-239.5 max-lg:w-920" />
        </div>
      </div>

      {/* Who we are */}
      <div className={`${FRAME} flex items-start pt-286 pl-179 max-lg:flex-col max-lg:justify-center max-lg:gap-40 max-lg:px-60 max-lg:pt-0`}>
        <div className="mt-59 w-501 shrink-0 overflow-hidden max-lg:mt-0">
          <div data-a="who-line" className="invisible">
            <Eyebrow className="fs-40 max-lg:text-sm">Who we are</Eyebrow>
          </div>
        </div>
        <div className="w-1087 max-lg:w-full">
          <h2 className="flex flex-col font-condensed font-bold text-white uppercase fs-110 leading-[0.855] tracking-[-0.04em]">
            <span className="overflow-hidden pt-10">
              <span data-a="who-line" className="invisible block">Bringing smart</span>
            </span>
            <span className="overflow-hidden pt-10">
              <span data-a="who-line" className="invisible ml-9 block">Vending to life</span>
            </span>
          </h2>
          <div className="mt-28 overflow-hidden">
            <p data-a="who-line" className="invisible font-medium text-white capitalize fs-34 leading-[1.47] tracking-[-0.02em] max-lg:text-base">
              Vend IQ delivers intelligent vending and micro-market solutions for modern residential, commercial and high-traffic spaces. We combine real-time
              data, smart technology, and hands-on service to create fully managed breakroom experiences that employees and
              customers actually use
            </p>
          </div>
        </div>
      </div>

      {/* Why choose Vend IQ */}
      {/* Mobile: two halves; the machine starts on the right and later crosses to the left. */}
      <div className={`${FRAME} grid grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)]`}>
        <div className={`${LAYER} flex justify-center pt-170 max-lg:pt-260`}>
          <h2 data-a="why-heading" className="invisible">
            <Eyebrow className="fs-36 max-lg:text-sm">Why choose vend iQ</Eyebrow>
          </h2>
        </div>

        <div
          data-a="pantry-slot"
          className={`${LAYER} flex justify-center pt-230 max-lg:w-1/2 max-lg:items-center max-lg:justify-self-end max-lg:pt-120`}
        >
          <div className="relative w-384.75 max-lg:w-auto">
            <Image data-a="arc-left" src={`${A}/arc-left.svg`} alt="" width={508} height={532} className="invisible absolute top-62 -left-204 h-532 w-508 max-w-none max-lg:hidden" />
            <Image data-a="arc-right" src={`${A}/arc-right.svg`} alt="" width={509} height={634} className="invisible absolute top-101 left-57 h-634 w-509 max-w-none max-lg:hidden" />
            <Image
              data-a="pantry"
              src={`${A}/machine-pantry.webp`}
              alt="VendIQ smart pantry machine"
              width={532}
              height={1315}
              sizes="(min-width: 1024px) 20vw, 40vw"
              className="invisible relative h-863 w-auto max-w-none max-lg:h-1150"
            />
          </div>
        </div>

        <ul className={`${LAYER} flex flex-col items-start pt-381 pl-193 max-lg:w-1/2 max-lg:justify-center max-lg:gap-60 max-lg:pt-120 max-lg:pr-30 max-lg:pl-60`}>
          {LEFT.map((c) => (
            <CalloutItem key={c.lines.join(" ")} c={c} side="left" />
          ))}
        </ul>
        <ul className={`${LAYER} flex flex-col items-start pt-417 pl-1282 max-lg:w-1/2 max-lg:justify-self-end max-lg:justify-center max-lg:gap-60 max-lg:pt-120 max-lg:pr-60 max-lg:pl-30`}>
          {RIGHT.map((c) => (
            <CalloutItem key={c.lines.join(" ")} c={c} side="right" />
          ))}
        </ul>
      </div>
    </ScrollScene>
  );
}
