"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ScrollScene, { FRAME, type SceneBuilder } from "@/components/scroll/ScrollScene";
import { poseFromBox, rectInStage, registerPose } from "@/components/scroll/TravelMachine";
import gsap from "gsap";

const A = "/images/vendiq";

/**
 * Figma 466:593, Default → Variant6.
 * Exploded mark → assembled logo → wordmark wipe → silk backdrop + header →
 * ember panel wipes in with headline + machine → outline wordmarks slide in.
 */
const build: SceneBuilder = (tl) => {
  const tl2 = gsap.timeline();
  tl2.fromTo("[data-a='silk']", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, "hero+=0.4")
    .fromTo(
      "[data-a='ember']",
      { clipPath: "inset(0% 0% 0% 100%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power2.inOut" },
      "hero+=1",
    )
    .fromTo(
      "[data-a='headline-line']",
      { autoAlpha: 0, clipPath: "inset(0% 100% 0% 0%)" },
      { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, stagger: 0.3, ease: "power2.out" },
      "hero+=1.6",
    )
    .fromTo(
      "[data-a='outline']",
      { autoAlpha: 0, xPercent: 110 },
      { autoAlpha: 0.33, xPercent: 0, duration: 1.6, stagger: 0.15, ease: "power2.out" },
      "hero+=2.6",
    )
    .to({}, { duration: 1 });
};

export default function IntroHero() {
  const slot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = slot.current;
    if (!el) return;
    return registerPose("hero", () => {
      const r = rectInStage(el);
      return poseFromBox(r.x, r.y, r.w);
    });
  }, []);

  return (
    <ScrollScene
      label="VendIQ — Smart vending reimagined"
      trackClassName="w-full"
      stageClassName="bg-white"
      build={build}
    >
      {/* Full-bleed backdrop: orange corner glow + silk, then the ember panel */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div data-a="silk" className="invisible absolute inset-0 bg-[linear-gradient(46.94deg,#fc5a0a_5.68%,#ffffff_24.66%)]">
          <Image src={`${A}/hero-silk.webp`} alt="" fill priority sizes="100vw" className="object-cover object-bottom opacity-33" />
        </div>
        <div data-a="ember" className="bg-ember-radial absolute inset-0 [clip-path:inset(0%_0%_0%_100%)]" />
      </div>

      {/* Outline wordmark fragments (decorative) drifting in from the right */}
      <div aria-hidden className={`${FRAME} pointer-events-none overflow-visible max-lg:hidden`}>
        <div data-a="outline" className="invisible absolute top-219.5 left-1024 h-188.75 w-894 overflow-hidden">
          <Image src={`${A}/outline-wordmark-b.svg`} alt="" width={894} height={234} className="h-233.75 w-894 max-w-none" />
        </div>
        <div data-a="outline" className="invisible absolute top-414 left-1490 h-189 w-432 overflow-hidden">
          <Image src={`${A}/outline-wordmark-c.svg`} alt="" width={894} height={234} className="h-233.75 w-894 max-w-none" />
        </div>
        <div data-a="outline" className="invisible absolute top-638 left-1024 h-188.75 w-894 overflow-hidden">
          <Image src={`${A}/outline-wordmark-a.svg`} alt="" width={894} height={234} className="h-233.75 w-894 max-w-none" />
        </div>
      </div>

      {/* Intro logo build-up */}
      {/* <div data-a="intro" aria-hidden className={`${LAYER} grid place-items-center`}>
        <div className="grid h-266 w-835 max-lg:[--spacing:calc(100vw/1500)]">
          <div data-a="logo-exploded" className={`${LAYER} h-full w-286 overflow-hidden`}>
            <Image src={`${A}/logo-exploded.svg`} alt="" width={1188} height={266} priority className="h-265.75 w-1188 max-w-none" />
          </div>
          <Image
            data-a="logo-assembled"
            src={`${A}/logo-assembled.svg`}
            alt=""
            width={748}
            height={188}
            className={`${LAYER} invisible mt-23.25 ml-45.75 h-188.25 w-748.25 max-w-none`}
          />
        </div>
      </div> */}

      {/* Headline + machine */}
      <div className={`${FRAME} flex items-start pl-175 max-lg:flex-col max-lg:px-60`}>
        <h1 className="flex w-769 shrink-0 flex-col pt-307 uppercase max-lg:w-full max-lg:pt-220">
          <span data-a="headline-line" className="invisible ml-9.75 font-sans font-bold text-white fs-92.75 leading-[1.2325] tracking-[-0.04em]">
            Smart
          </span>
          <span data-a="headline-line" className="invisible -mt-24.25 font-condensed font-bold text-sun fs-187.5 leading-[0.964] tracking-[-0.02em]">
            Vending
          </span>
          <span data-a="headline-line" className="invisible -mt-42 ml-9.75 font-sans font-bold text-white fs-92.75 leading-[1.2325] tracking-[-0.04em]">
            Reimagined
          </span>
        </h1>
      </div>

      {/* Where the travelling machine (TravelMachine) sits in the hero */}
      <div
        ref={slot}
        role="img"
        aria-label="VendIQ smart vending machine stocked with drinks"
        className="pointer-events-none absolute top-0 right-[18.7%] aspect-[624/1392] w-[634px]"
      />

    </ScrollScene>
  );
}
