"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BrandMark from "@/components/brand/BrandMark";
import { jumpToScroll } from "@/components/scroll/ScrollScene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Scroll (Figma px) over which the footer rises in: 466:5762 → 466:5990. */
const FOOTER_RISE = 280;

/**
 * Ember footer that wipes up from the bottom over the last stretch of scroll.
 * Render inside a `.flow-units` parent.
 */
export default function SiteFooter({ className = "" }: { className?: string }) {
  const footer = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
        // Same unit as `.flow-units` (one Figma px).
        const rise = () => (FOOTER_RISE * window.innerWidth) / 1920;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: footer.current,
              start: () => ScrollTrigger.maxScroll(window) - rise(),
              end: "max",
              scrub: 0.4,
              invalidateOnRefresh: true,
              onRefresh: jumpToScroll,
            },
          })
          .fromTo("[data-a='footer-bg']", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 })
          .fromTo(
            "[data-a='footer-content']",
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
            0.4,
          );
      });
    },
    { scope: footer },
  );

  return (
    <footer ref={footer} className={`relative isolate flex flex-col items-center pb-25 text-[#fbfbfb] ${className}`}>
      <div data-a="footer-bg" aria-hidden className="bg-ember-radial absolute inset-0 -z-10" />
      <div data-a="footer-content" className="flex w-1093 items-center justify-between max-lg:w-full max-lg:flex-col max-lg:items-start max-lg:gap-24 max-lg:px-24">
        <BrandMark className="fs-83" wordmarkClassName="text-white" />
        <div className="mt-22 mr-16 flex items-center gap-62 font-medium capitalize fs-20 max-lg:mt-0 max-lg:mr-0 max-lg:flex-col max-lg:items-start max-lg:gap-12">
          <a href="mailto:info@vendiq.net" className="flex items-center gap-13 hover:text-sun">
            <span aria-hidden className="size-34 bg-white [mask-image:url(/images/vendiq/icon-mail-mask.png)] [mask-size:100%]" />
            Info@Vendiq.Net
          </a>
          <a href="tel:+16236883769" className="flex items-center gap-9 hover:text-sun">
            <span aria-hidden className="size-32 bg-white [mask-image:url(/images/vendiq/icon-phone-mask.png)] [mask-size:100%]" />
            (623)-688-3769
          </a>
        </div>
      </div>
      <p data-a="footer-content" className="mt-131 font-medium text-[#fcca5a] fs-20 max-lg:mt-48">Copyright © Vend IQ — All Rights Reserved</p>
    </footer>
  );
}
