"use client";

import Image from "next/image";
import ScrollScene, { FRAME, LAYER, type SceneBuilder } from "@/components/scroll/ScrollScene";

const A = "/images/vendiq";

type Callout = {
  text: string;
  /** Figma offsets: left indent from the column edge, gap from previous item. */
  indent: string;
  gap: string;
  textWidth: string;
  connector: { src: string; width: number; className: string };
};

const LEFT: Callout[] = [
  { text: "Smarter Vending. Better Experience", indent: "ml-99", gap: "", textWidth: "w-311", connector: { src: "connector-left-1.svg", width: 391, className: "left-15 -top-19 w-391" } },
  { text: "Built for Modern Workplaces", indent: "ml-0", gap: "mt-110", textWidth: "w-352", connector: { src: "connector-left-2.svg", width: 340, className: "left-86 -top-23 w-340" } },
  { text: "The Vend IQ Difference", indent: "ml-93", gap: "mt-93", textWidth: "w-308", connector: { src: "connector-left-3.svg", width: 296, className: "left-98 -top-18 w-296" } },
];

const RIGHT: Callout[] = [
  { text: "HD Digital Display", indent: "ml-0", gap: "", textWidth: "w-196", connector: { src: "connector-right.svg", width: 238, className: "-left-49 top-1 w-238" } },
  { text: "Digital Price Tags", indent: "ml-55", gap: "mt-72", textWidth: "w-217", connector: { src: "connector-right.svg", width: 238, className: "-left-30 top-0 w-238" } },
  { text: "POS with Smart Lock", indent: "ml-65", gap: "mt-82", textWidth: "w-278", connector: { src: "connector-right.svg", width: 238, className: "-left-47 top-2 w-238" } },
  { text: "Cellular, WiFi Included", indent: "ml-25", gap: "mt-82", textWidth: "w-282", connector: { src: "connector-right-long.svg", width: 319, className: "-left-70 top-0 w-319" } },
];

function CalloutItem({ c, side }: { c: Callout; side: "left" | "right" }) {
  return (
    <li
      data-a={`callout-${side}`}
      className={`invisible relative ${c.indent} ${c.gap} ${c.textWidth} font-bold text-white capitalize fs-30 leading-[0.934] tracking-[-0.02em] ${side === "left" ? "text-right" : ""} max-lg:m-0 max-lg:w-auto max-lg:text-left max-lg:text-base`}
    >
      <Image
        data-a="connector"
        src={`${A}/${c.connector.src}`}
        alt=""
        width={c.connector.width}
        height={71}
        className={`pointer-events-none absolute h-71 max-w-none ${side === "left" ? "rotate-180" : ""} ${c.connector.className} max-lg:hidden`}
      />
      <span className="relative">{c.text}</span>
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
 * Figma 471:10924 → 479:13722.
 * Who we are: outline wordmarks frame the statement. They part, and the
 * "why choose" diagram assembles around the pantry machine.
 */
const build: SceneBuilder = (tl) => {
  tl.fromTo("[data-a='glow']", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 })
    .fromTo("[data-a='outline-top']", { yPercent: -100 }, { yPercent: 0, duration: 1.2, ease: "power2.out" }, 0.2)
    .fromTo("[data-a='outline-bottom']", { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "power2.out" }, 0.2)
    .fromTo(
      "[data-a='who-line']",
      { autoAlpha: 0, yPercent: 110 },
      { autoAlpha: 1, yPercent: 0, duration: 1, stagger: 0.25, ease: "power2.out" },
      1,
    )
    .to({}, { duration: 1 })
    .addLabel("exit")
    .to("[data-a='who-line']", { yPercent: -110, duration: 0.9, stagger: 0.08, ease: "power2.in" }, "exit")
    .to("[data-a='outline-top']", { yPercent: -110, duration: 1.2, ease: "power2.in" }, "exit")
    // Bottom outline travels to the top edge (842 → -53 Figma px).
    .to("[data-a='outline-bottom']", { yPercent: -387, duration: 1.6, ease: "power2.inOut" }, "exit")
    .addLabel("why", "exit+=1")
    .fromTo("[data-a='why-heading']", { autoAlpha: 0, yPercent: -60 }, { autoAlpha: 1, yPercent: 0, duration: 0.8 }, "why")
    .fromTo("[data-a='pantry']", { autoAlpha: 0, yPercent: 45 }, { autoAlpha: 1, yPercent: 0, duration: 1.4, ease: "power3.out" }, "why")
    .fromTo("[data-a='arc-left']", { autoAlpha: 0, rotate: -70, scale: 0.7 }, { autoAlpha: 1, rotate: 0, scale: 1, duration: 1.2, ease: "power2.out" }, "why+=0.6")
    .fromTo("[data-a='arc-right']", { autoAlpha: 0, rotate: 70, scale: 0.7 }, { autoAlpha: 1, rotate: 0, scale: 1, duration: 1.2, ease: "power2.out" }, "why+=0.6")
    .fromTo("[data-a='callout-left']", { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.25 }, "why+=1.4")
    .fromTo("[data-a='callout-right']", { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.25 }, "why+=1.5")
    .to({}, { duration: 1.2 });
};

export default function BrandStory() {
  return (
    <ScrollScene id="about" label="About VendIQ" trackClassName="h-[700vh]" stageClassName="bg-ember-linear" build={build}>
      {/* Warm glows (decorative) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image data-a="glow" src={`${A}/glow-sun.svg`} alt="" width={2526} height={2526} className="invisible absolute top-[-74%] left-[0.2%] w-[132%] max-w-none" />
        <Image data-a="glow" src={`${A}/glow-orange.svg`} alt="" width={2526} height={2526} className="invisible absolute top-[-84%] left-[-21%] w-[132%] max-w-none" />
      </div>

      {/* Outline wordmarks (decorative) */}
      <div aria-hidden className={`${FRAME} pointer-events-none`}>
        <div className="absolute top-12 left-145 h-172 w-1567 overflow-hidden">
          <Image data-a="outline-top" src={`${A}/outline-wordmark-top.svg`} alt="" width={1567} height={409} className="h-408.5 w-1567 max-w-none" />
        </div>
        <div data-a="outline-bottom" className="absolute top-842 left-145 h-231 w-1567 overflow-hidden">
          <Image src={`${A}/outline-wordmark-bottom.svg`} alt="" width={1567} height={408} className="-mt-177 h-408 w-1567 max-w-none" />
        </div>
      </div>

      {/* Who we are */}
      <div className={`${FRAME} flex items-start pt-286 pl-179 max-lg:flex-col max-lg:gap-40 max-lg:px-60 max-lg:pt-240`}>
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
              Vend IQ delivers intelligent vending and micro-market solutions designed for modern workplaces. We combine real-time
              data, smart technology, and hands-on service to create fully managed breakroom experiences that employees and
              customers actually use
            </p>
          </div>
        </div>
      </div>

      {/* Why choose Vend IQ */}
      <div className={`${FRAME} grid grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] max-lg:flex max-lg:flex-col max-lg:items-center max-lg:gap-40 max-lg:pt-160`}>
        <div className={`${LAYER} flex justify-center pt-170`}>
          <h2 data-a="why-heading" className="invisible max-lg:order-first">
            <Eyebrow className="fs-36">Why choose vend iQ</Eyebrow>
          </h2>
        </div>

        <div className={`${LAYER} flex justify-center pt-230 max-lg:pt-0`}>
          <div className="relative w-384.75">
            <Image data-a="arc-left" src={`${A}/arc-left.svg`} alt="" width={508} height={532} className="invisible absolute top-62 -left-204 h-532 w-508 max-w-none origin-right" />
            <Image data-a="arc-right" src={`${A}/arc-right.svg`} alt="" width={509} height={634} className="invisible absolute top-101 left-57 h-634 w-509 max-w-none origin-left" />
            <Image
              data-a="pantry"
              src={`${A}/machine-pantry.webp`}
              alt="VendIQ smart pantry machine"
              width={532}
              height={1315}
              sizes="(min-width: 1024px) 20vw, 40vw"
              className="invisible relative h-863 w-auto max-w-none"
            />
          </div>
        </div>

        <ul className={`${LAYER} flex flex-col items-start pt-381 pl-193 max-lg:gap-12 max-lg:p-0`}>
          {LEFT.map((c) => (
            <CalloutItem key={c.text} c={c} side="left" />
          ))}
        </ul>
        <ul className={`${LAYER} flex flex-col items-start pt-417 pl-1282 max-lg:gap-12 max-lg:p-0`}>
          {RIGHT.map((c) => (
            <CalloutItem key={c.text} c={c} side="right" />
          ))}
        </ul>
      </div>
    </ScrollScene>
  );
}
