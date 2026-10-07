"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FRAME, LAYER } from "@/components/scroll/ScrollScene";
import { MACHINE_H, MACHINE_SRC, MACHINE_W } from "@/components/scroll/TravelMachine";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const A = "/images/vendiq";

/**
 * Same entrance language as the homepage hero: silk → ember wipe → headline
 * clip reveal (the big word settles from 1.2) → machine wipes up from the
 * bottom → outline wordmarks slide in together. The machine and outlines
 * follow the pointer, and the copy drifts away as the page scrolls.
 */
export default function ContactHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ delay: 0.2 })
          .fromTo("[data-a='silk']", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0)
          .fromTo(
            "[data-a='ember']",
            { clipPath: "inset(0% 0% 0% 100%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power2.inOut" },
            0.4,
          )
          .fromTo(
            "[data-a='headline-line']",
            { autoAlpha: 0, clipPath: "inset(0% 100% 0% 0%)" },
            { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, stagger: 0.3, ease: "power2.out" },
            1,
          )
          .fromTo(
            "[data-a-scale='big']",
            { scale: 1.2, transformOrigin: "left center" },
            { scale: 1, duration: 1.2, ease: "power2.out" },
            1.3,
          )
          .fromTo(
            "[data-a='machine']",
            { autoAlpha: 0, yPercent: 40, clipPath: "inset(100% 0% 0% 0%)" },
            { autoAlpha: 1, yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "power3.out" },
            1.2,
          )
          .fromTo("[data-a='hero-sub']", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, 2)
          .fromTo("[data-a='hero-cta']", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }, 2.15)
          .fromTo(
            "[data-a='outline']",
            { autoAlpha: 0, xPercent: 110 },
            { autoAlpha: 0.33, xPercent: 0, duration: 1.6, ease: "power2.out" },
            2,
          );

        // Copy lifts and fades, machine drifts slower, as the hero scrolls away.
        const away = { trigger: el, start: "top top", end: "bottom top", scrub: 0.4 };
        gsap.to("[data-a='hero-copy']", { yPercent: -25, opacity: 0.15, ease: "none", scrollTrigger: away });
        gsap.to("[data-a='hero-machine']", { yPercent: -10, ease: "none", scrollTrigger: away });

        // Pointer parallax on mouse/trackpad only.
        if (!window.matchMedia("(pointer: fine)").matches) return;
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", el).map((node) => ({
          depth: Number(node.dataset.depth),
          x: gsap.quickTo(node, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(node, "y", { duration: 0.8, ease: "power3.out" }),
        }));
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          layers.forEach((l) => {
            l.x(nx * l.depth);
            l.y(ny * l.depth);
          });
        };
        const onLeave = () => layers.forEach((l) => (l.x(0), l.y(0)));
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });

      // Reduced motion: show the settled state straight away.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-a='ember'], [data-a='machine']", { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set("[data-a='silk'], [data-a='headline-line'], [data-a='machine'], [data-a='hero-sub'], [data-a='hero-cta']", { autoAlpha: 1 });
        gsap.set("[data-a='outline']", { autoAlpha: 0.33 });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="contact-hero-heading"
      className="scene-units relative grid h-screen min-h-[560px] grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden bg-white"
    >
      {/* Full-bleed backdrop: orange corner glow + silk, then the ember panel */}
      <div aria-hidden className={`${LAYER} pointer-events-none relative`}>
        <div data-a="silk" className="invisible absolute inset-0 bg-[linear-gradient(46.94deg,#fc5a0a_5.68%,#ffffff_24.66%)]">
          <Image src={`${A}/hero-silk.webp`} alt="" fill priority sizes="100vw" className="object-cover object-bottom opacity-33" />
        </div>
        <div data-a="ember" className="bg-ember-radial absolute inset-0 [clip-path:inset(0%_0%_0%_100%)]" />
      </div>

      {/* Outline wordmark fragments (decorative) */}
      <div aria-hidden className={`${FRAME} pointer-events-none overflow-visible max-lg:hidden`}>
        <div data-depth="-36" className="absolute inset-0">
          <div data-a="outline" className="invisible absolute top-120 left-1024 h-188.75 w-894 overflow-hidden">
            <Image src={`${A}/outline-wordmark-b.svg`} alt="" width={894} height={234} className="h-233.75 w-894 max-w-none" />
          </div>
          <div data-a="outline" className="invisible absolute top-560 left-1150 h-188.75 w-894 overflow-hidden">
            <Image src={`${A}/outline-wordmark-a.svg`} alt="" width={894} height={234} className="h-233.75 w-894 max-w-none" />
          </div>
        </div>
      </div>

      {/* Machine */}
      <div aria-hidden className={`${FRAME} pointer-events-none`}>
        <div data-a="hero-machine" className="absolute top-130 right-260 w-540 max-lg:top-auto max-lg:right-[6%] max-lg:bottom-[-24%] max-lg:w-[50%]">
          <div data-depth="28">
            <Image
              data-a="machine"
              src={MACHINE_SRC}
              alt=""
              width={MACHINE_W}
              height={MACHINE_H}
              priority
              sizes="(min-width: 1024px) 30vw, 55vw"
              className="invisible h-auto w-full"
            />
          </div>
        </div>
      </div>

      {/* Headline, intro + quick actions */}
      <div className={`${FRAME} flex items-start pl-175 max-lg:px-60`}>
        <div data-a="hero-copy" className="flex flex-col pt-250 max-lg:pt-440">
          <h1 id="contact-hero-heading" className="flex w-769 flex-col uppercase max-lg:w-full">
            <span data-a="headline-line" className="invisible ml-9.75 font-sans font-bold text-white fs-92.75 leading-[1.2325] tracking-[-0.04em]">
              Get in
            </span>
            <span
              data-a="headline-line"
              data-a-scale="big"
              className="invisible -mt-24.25 font-condensed font-bold text-sun fs-187.5 leading-[0.964] tracking-[-0.02em]"
            >
              Touch
            </span>
            <span data-a="headline-line" className="invisible -mt-24 ml-9.75 font-sans font-bold text-white fs-92.75 leading-[1.2325] tracking-[-0.04em]">
              With VendIQ
            </span>
          </h1>

          <p data-a="hero-sub" className="invisible mt-40 ml-12 w-640 font-medium text-white/85 fs-24 leading-[1.45] tracking-[-0.02em] max-lg:w-[78%] max-lg:fs-32">
            Tell us about your space and we’ll help you find the right smart vending setup — from a single machine to a full micro-market.
          </p>

          <div className="mt-48 ml-12 flex flex-wrap items-center gap-20">
            <a
              data-a="hero-cta"
              href="#contact-form"
              className="invisible flex h-60 items-center gap-10 rounded-[6px] border border-[#e6e6e6] bg-white px-28 font-medium text-[#0f0f0f] capitalize fs-20 tracking-[-0.04em] transition-colors hover:border-brand hover:bg-sun max-lg:h-100 max-lg:px-40 max-lg:fs-30"
            >
              <Image src={`${A}/logo-mark.png`} alt="" width={112} height={85} className="h-31 w-auto max-lg:h-44" />
              Send us a message
            </a>
            <a
              data-a="hero-cta"
              href="tel:+16236883769"
              className="invisible flex h-60 items-center gap-12 rounded-[6px] border border-white/60 px-28 font-medium text-white fs-20 tracking-[-0.04em] transition-colors hover:border-sun hover:text-sun max-lg:h-100 max-lg:px-40 max-lg:fs-30"
            >
              <span aria-hidden className="size-26 bg-current [mask-image:url(/images/vendiq/icon-phone-mask.png)] [mask-size:100%] max-lg:size-36" />
              (623)-688-3769
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
