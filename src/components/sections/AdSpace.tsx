"use client";

import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import ScrollScene, { FRAME, type SceneBuilder } from "@/components/scroll/ScrollScene";

const A = "/images/vendiq";

/**
 * Figma 466:5198 → 466:5556.
 * The micromart trio sinks into the bottom of a rising ember card, then the
 * white pitch panel slides up beside the "Ad space" label.
 */
const build: SceneBuilder = (tl, root) => {
  const card = root.querySelector<HTMLElement>("[data-a='ad-card']");
  const trio = root.querySelector<HTMLElement>("[data-a='trio']");
  // Crop the trio exactly at the card's bottom edge on every frame, so it never hangs below the card.
  const clipToCard = () => {
    if (!card || !trio) return;
    const c = card.getBoundingClientRect();
    const t = trio.getBoundingClientRect();
    const cut = gsap.utils.clamp(0, 100, ((t.bottom - c.bottom) / t.height) * 100);
    gsap.set(trio, { clipPath: `inset(0% 0% ${cut}% 0% round 29px 30px 0 0)` });
  };

  tl.fromTo("[data-a='ad-card']", { yPercent: 128 }, { yPercent: 0, duration: 1.6, ease: "power2.inOut" })
    .fromTo(
      "[data-a='trio']",
      // Variant31: 1013 px wide at y=186 → Variant33: 1117 px wide at y=607, cropped at the card edge.
      { yPercent: -48.1, scale: 0.907 },
      { yPercent: 0, scale: 1, duration: 1.6, ease: "power2.inOut", onUpdate: clipToCard },
      0,
    )
    .fromTo("[data-a='ad-panel']", { yPercent: 100 }, { yPercent: 0, duration: 1.1, ease: "power3.out" }, 1.2)
    .fromTo("[data-a='ad-label']", { autoAlpha: 0, yPercent: 110 }, { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: "power2.out" }, 1.4)
    .to({}, { duration: 1.4 });
};

export default function AdSpace() {
  return (
    <ScrollScene id="ad-space" label="Ad space on LCD screen" trackClassName="h-[350vh]" stageClassName="bg-white" build={build}>
      <div className={`${FRAME} flex justify-center pt-214 max-lg:px-24 max-lg:pt-120`}>
        <div
          data-a="ad-card"
          className="bg-ember-linear flex h-681 w-1572 items-start gap-101 rounded-[20px] pt-8 pl-85 max-lg:h-auto max-lg:w-full max-lg:flex-col max-lg:gap-24 max-lg:p-40 max-lg:pb-[45vw]"
        >
          <div className="mt-140 w-379 shrink-0 overflow-hidden max-lg:mt-0">
            <h2 data-a="ad-label" className="invisible flex items-start gap-14 font-bold text-[#fffcf6] uppercase fs-40 tracking-[-0.02em] max-lg:text-lg">
              <Image src="/images/vendiq/logo-mark.png" alt="" width={112} height={85} className="mt-35 h-33 w-auto max-lg:mt-1" />
              <span>
                Ad space on
                <br />
                LCD screen
              </span>
            </h2>
          </div>
          <div className="h-666 w-979 overflow-hidden pt-22 max-lg:h-auto max-lg:w-full">
            <div data-a="ad-panel" className="flex h-620 flex-col items-start rounded-[20px] bg-white pt-73 pl-98 max-lg:h-auto max-lg:p-24">
              <p className="w-784 font-medium text-[#242121] capitalize fs-34 leading-[1.294] tracking-[-0.02em] max-lg:w-full max-lg:text-base">
                Frame it as an opportunity. For example, a dealership could use the screen for branding and marketing, enhancing
                their business.
              </p>
              <Link
                href="/contact"
                className="mt-49 flex h-56 items-center gap-10 rounded-[6px] border border-[#e6e6e6] bg-[#1a1a1a] pr-24 pl-20 font-medium text-white capitalize fs-17 transition-colors hover:bg-brand max-lg:h-11 max-lg:text-sm"
              >
                <Image src={`${A}/logo-mark.png`} alt="" width={112} height={85} className="h-31 w-auto max-lg:h-5" />
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Product shot overlapping the card's bottom edge */}
      <div className={`${FRAME} pointer-events-none flex justify-center pt-607 max-lg:items-end max-lg:pb-40`}>
        <Image
          data-a="trio"
          src={`${A}/micromart-trio.webp`}
          alt="Three VendIQ micromart fridges with LCD ad screens"
          width={1013}
          height={794}
          sizes="(min-width: 1024px) 60vw, 90vw"
          className="h-auto w-1117 max-w-none origin-top self-start max-lg:self-end"
        />
      </div>
    </ScrollScene>
  );
}
