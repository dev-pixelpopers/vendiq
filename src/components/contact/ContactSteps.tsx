"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { jumpToScroll } from "@/components/scroll/ScrollScene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const A = "/images/vendiq";

const STEPS = [
  { title: "Tell us about your space", body: "Share your location, foot traffic and what your people want to grab on the go." },
  { title: "We plan the right setup", body: "We recommend the machine and product mix that fit your space and your audience." },
  { title: "Install & tap to pay", body: "Your machine goes in stocked and ready. Tap to pay, grab and go, done." },
];

/** Ember card (as in Ad space) whose progress line fills and lights each step as you scroll. */
export default function ContactSteps() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-a='steps-card']",
          { yPercent: 18, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 80%" },
          },
        );

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "[data-a='steps']",
            start: "top 75%",
            end: "bottom 40%",
            scrub: 0.4,
            onRefresh: jumpToScroll,
          },
        });
        tl.fromTo("[data-a='steps-fill']", { scaleX: 0 }, { scaleX: 1, duration: 3 }, 0);
        gsap.utils.toArray<HTMLElement>("[data-a='step']", root.current).forEach((step, i) => {
          tl.fromTo(step, { opacity: 0.35 }, { opacity: 1, duration: 0.6 }, i * 1.2)
            .fromTo(
              step.querySelector("[data-a='step-num']"),
              { backgroundColor: "rgba(253,203,91,0)", color: "#ffffff", borderColor: "rgba(255,255,255,0.35)" },
              { backgroundColor: "rgba(253,203,91,1)", color: "#692300", borderColor: "rgba(253,203,91,1)", duration: 0.6 },
              i * 1.2,
            );
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-a='steps-card']", { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="steps-heading" className="flow-units flex justify-center pt-200 max-lg:px-24 max-lg:pt-100">
      <div data-a="steps-card" className="bg-ember-linear invisible w-1572 rounded-[20px] px-85 pt-90 pb-110 text-white max-lg:w-full max-lg:px-36 max-lg:pt-56 max-lg:pb-64">
        <header className="flex items-end gap-140 max-lg:flex-col max-lg:items-start max-lg:gap-12">
          <p className="flex shrink-0 items-center gap-15 pb-12 font-bold text-[#fffcf6] uppercase fs-40 tracking-[-0.02em]">
            <Image src={`${A}/logo-mark.png`} alt="" width={112} height={85} className="h-33 w-auto" />
            How it works
          </p>
          <h2 id="steps-heading" className="pt-8 font-condensed font-bold uppercase fs-93 leading-[0.825] tracking-[-0.04em]">
            From hello to <span className="text-sun">tap &amp; go</span>
          </h2>
        </header>

        <ol data-a="steps" className="relative mt-100 grid grid-cols-3 gap-60 max-lg:mt-48 max-lg:grid-cols-1 max-lg:gap-40">
          {/* Progress line through the step numbers (desktop) */}
          <span aria-hidden className="absolute top-36 right-[16%] left-36 h-2 bg-white/20 max-lg:hidden">
            <span data-a="steps-fill" className="block h-full origin-left bg-sun" />
          </span>
          {STEPS.map((s, i) => (
            <li key={s.title} data-a="step" className="relative flex flex-col">
              <span
                data-a="step-num"
                className="grid size-72 place-items-center rounded-full border-2 border-sun bg-sun font-condensed font-bold text-ember fs-36 max-lg:size-96 max-lg:fs-44"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-36 font-bold fs-32 leading-[1.1] tracking-[-0.02em] max-lg:mt-20">{s.title}</h3>
              <p className="mt-16 w-420 font-normal text-white/75 fs-20 leading-[1.45] tracking-[-0.02em] max-lg:w-full">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
