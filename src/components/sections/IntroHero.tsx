"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ScrollScene, { FRAME, type SceneBuilder } from "@/components/scroll/ScrollScene";
import { poseFromBox, rectInStage, registerPose } from "@/components/scroll/TravelMachine";
import gsap from "gsap";
import Preloader from "@/components/intro/Preloader";
import { whenIntroDone } from "@/components/intro/intro";

const A = "/images/vendiq";

/**
 * Figma 466:593. The preloader (495:14202) ends on the ember filling the
 * screen, which stays as this hero's background; then the headline wipes in,
 * the machine rises and the outline wordmarks slide in.
 */
const build: SceneBuilder = (_tl, _root, { reduced }) => {
  const intro = gsap.timeline({ paused: true });
  intro
    .fromTo(
      "[data-a='headline-line']",
      { autoAlpha: 0, clipPath: "inset(0% 100% 0% 0%)" },
      { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, stagger: 0.3, ease: "power2.out" },
      0.2,
    )
    // "Vending" settles to 1 alongside its own clip-path wipe (2nd line: 0.2 + 0.3 stagger).
    .fromTo(
      "[data-a-scale='vending']",
      { scale: 1.4, transformOrigin: "left center" },
      { scale: 1, duration: 1.2, ease: "power2.out" },
      0.5,
    )
    .fromTo(
      "[data-a='outline']",
      { autoAlpha: 0, xPercent: 110 },
      { autoAlpha: 0.33, xPercent: 0, duration: 1.6, ease: "power2.out" },
      1.2,
    );
  const off = whenIntroDone(() => (reduced ? intro.progress(1) : intro.play()));
  return () => {
    off();
    intro.kill();
  };
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
      {/* Preloader; its ember stays behind as the full-bleed backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Preloader />
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
      <div className={`${FRAME} flex items-center pl-175 max-lg:flex-col max-lg:px-60`}>
        <h1 className="flex w-769 shrink-0 flex-col uppercase max-lg:w-full max-lg:pt-220">
          {/* <span data-a="headline-line" className="invisible ml-9.75 font-sans font-bold text-white fs-92.75 leading-[1.2325] tracking-[-0.04em]">
            Smart
          </span> */}
          <span data-a="headline-line" data-a-scale="vending" className="invisible -mt-24.25 font-condensed font-bold text-sun fs-187.5 leading-[0.964] tracking-[-0.02em]">
            Vending
          </span>
          <span data-a="headline-line" className="invisible -mt-42 ml-9.75 font-sans font-bold text-white fs-92.75 leading-[1.2325] tracking-[-0.04em]">
            Done Smart
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
