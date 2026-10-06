"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ScrollScene, { FRAME, LAYER, type SceneBuilder } from "@/components/scroll/ScrollScene";
import {
  MACHINE_H,
  MACHINE_SRC,
  MACHINE_W,
  poseFromBox,
  rectInStage,
  registerDock,
  registerPose,
  setTravel,
} from "@/components/scroll/TravelMachine";

const A = "/images/vendiq";

const VENUES = [
  { label: "Residential Communities", src: `${A}/venue-mall.webp`, position: "object-[50%_65%]", shade: "bg-[linear-gradient(180deg,rgba(0,0,0,0)_54.7%,rgba(0,0,0,0.46)_84.8%)]" },
  { label: "Fitness & Gym", src: `${A}/venue-gym.webp`, position: "object-[50%_95%]", shade: "bg-[linear-gradient(180deg,rgba(0,0,0,0)_47.6%,rgba(0,0,0,0.46)_77.3%)]" },
  { label: "Commercial Spaces", src: `${A}/venue-hospital.webp`, position: "object-[50%_61%]", shade: "" },
] as const;

/**
 * Figma 466:593, Variant66 → Variant74 (+ 471:10924).
 * The machine pulls back under the title, then each venue wipes in behind it
 * with its label; the About section then slides down over it from the top.
 */
/** Oversized entry placement (Variant65); percentages of the 414 Figma px machine box. */
const ENTRY = { xPercent: 42.03, yPercent: -59.76, scale: 1.737 };

const build: SceneBuilder = (tl) => {
  // The travelling machine arrives at ENTRY; the in-stage copy takes over as
  // soon as the playhead leaves 0, then settles at Variant69.
  tl.eventCallback("onUpdate", () => setTravel({ docked: tl.time() > 0.001 }));
  tl.fromTo(
      "[data-a='machine']",
      ENTRY,
      { xPercent: 0, yPercent: 0, scale: 1, duration: 2, ease: "power2.inOut" },
      0,
    )
    .fromTo("[data-a='title']", { yPercent: -160 }, { yPercent: 0, duration: 1.2, ease: "power2.out" }, 1)
    .addLabel("venues", "+=0.2")
    .to("[data-a='title']", { yPercent: -160, duration: 1, ease: "power2.in" }, "venues")
    .to("[data-a='machine']", { xPercent: -4.59, yPercent: -25.28, scale: 1.0918, duration: 1.2, ease: "power2.inOut" }, "venues")
    .fromTo("[data-a='venue-shade']", { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0, duration: 1.2 }, "venues+=0.4");

  VENUES.forEach((_, i) => {
    const at = 0.4 + i * 2;
    tl.fromTo(
      `[data-a='venue']:nth-child(${i + 1})`,
      { clipPath: "inset(0% 0% 0% 100%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power2.inOut" },
      `venues+=${at}`,
    ).fromTo(
      `[data-a='venue-label']:nth-child(${i + 1})`,
      { autoAlpha: 0, yPercent: 110 },
      { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: "power2.out" },
      `venues+=${at + 0.5}`,
    );
    if (i > 0) {
      tl.to(
        `[data-a='venue-label']:nth-child(${i})`,
        { autoAlpha: 0, yPercent: -110, duration: 0.6, ease: "power2.in" },
        `venues+=${at + 0.2}`,
      );
    }
  });

  // Last stretch (~100vh): the About section slides down over this stage
  // (BrandStory overlaps the end of this track), so Industries holds still.
  tl.to({}, { duration: 1.4 }, "+=0.8");
};

export default function Industries() {
  const slot = useRef<HTMLDivElement>(null);
  const machine = useRef<HTMLImageElement>(null);

  // Where the travelling machine lands: the slot's layout box with ENTRY applied.
  useEffect(() => {
    const el = slot.current;
    const img = machine.current;
    if (!el || !img) return;
    const offPose = registerPose("industries", () => {
      const r = rectInStage(el);
      return poseFromBox(r.x + (ENTRY.xPercent / 100) * r.w, r.y + (ENTRY.yPercent / 100) * r.h, r.w * ENTRY.scale);
    });
    const offDock = registerDock(img);
    return () => {
      offPose();
      offDock();
    };
  }, []);

  return (
    <ScrollScene id="industries" label="Industries we serve" trackClassName="h-[650vh]" stageClassName="bg-white" build={build}>
      {/* Venue backdrops, wiped in from the right */}
      <div aria-hidden className={`${LAYER} grid grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)]`}>
        {VENUES.map((v) => (
          <div key={v.label} data-a="venue" className={`${LAYER} relative [clip-path:inset(0%_0%_0%_100%)]`}>
            <Image src={v.src} alt="" fill loading="eager" sizes="100vw" className={`object-cover ${v.position}`} />
            {v.shade && <div className={`absolute inset-0 ${v.shade}`} />}
          </div>
        ))}
      </div>
      <div
        data-a="venue-shade"
        aria-hidden
        className={`${LAYER} invisible self-end h-[63%] bg-[linear-gradient(180deg,rgba(100,48,13,0)_6.4%,#692300_91.7%)]`}
      />

      {/* Fridge + title + venue labels */}
      <div className={`${FRAME} flex flex-col items-center`}>
        <div className="mt-109 h-169 w-951 shrink-0 overflow-hidden text-center max-lg:mt-160 max-lg:h-auto max-lg:w-full">
          <div data-a="title" className="flex flex-col items-center gap-14 max-lg:px-40">
            <h2 className="font-condensed font-bold text-brand-deep uppercase fs-80 leading-[0.948] tracking-[-0.04em]">
              Industries we serve
            </h2>
            <p className="w-860 font-medium text-black fs-25 max-lg:w-full max-lg:text-sm">
              From residential communities to premium commercial environments, VENDI IQ fits where traditional vending doesn&apos;t.
            </p>
          </div>
        </div>
        <div ref={slot} className="-mt-50 w-414 shrink-0">
          <Image
            ref={machine}
            data-a="machine"
            src={MACHINE_SRC}
            alt="VendIQ smart vending machine stocked with drinks"
            width={MACHINE_W}
            height={MACHINE_H}
            sizes="(min-width: 1024px) 50vw, 90vw"
            className="invisible block h-auto w-full max-w-none origin-top-left"
          />
        </div>
      </div>

      <div className={`${FRAME} pointer-events-none flex justify-center`}>
        <ul className="mt-754 grid h-108 w-1032 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden max-lg:mt-[70vh] max-lg:w-full">
          {VENUES.map((v) => (
            <li
              key={v.label}
              data-a="venue-label"
              className={`${LAYER} invisible self-center text-center font-condensed font-bold text-white capitalize fs-80 leading-none tracking-[-0.06em]`}
            >
              {v.label}
            </li>
          ))}
        </ul>
      </div>
    </ScrollScene>
  );
}
