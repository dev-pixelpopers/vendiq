"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContactForm from "@/components/contact/ContactForm";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const A = "/images/vendiq";

type ContactFormSectionProps = {
  id?: string;
  /** The two heading lines. */
  heading?: readonly [string, string];
  /** Section padding / scroll offset. */
  className?: string;
  /** Soft peach glow above the card (homepage). */
  glow?: boolean;
};

/**
 * The contact card (homepage + contact page). Render inside a `.flow-units`
 * parent. On scroll: the card lifts in, the heading lines rise, then each
 * field's underline and label wipe in from the left and the submit button pops.
 */
export default function ContactFormSection({
  id = "contact-form",
  heading = ["Request a machine", "for your space"],
  className = "scroll-mt-40 pt-200 max-lg:pt-100",
  glow = false,
}: ContactFormSectionProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-a='form-card']", start: "top 82%" } })
          .fromTo("[data-a='form-card']", { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" })
          .fromTo(
            "[data-a='form-head']",
            { autoAlpha: 0, yPercent: 110 },
            { autoAlpha: 1, yPercent: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
            0.25,
          )
          .set("[data-a='form-body']", { autoAlpha: 1 }, 0.5)
          .fromTo(
            "[data-a='field']",
            { autoAlpha: 0, y: 24, clipPath: "inset(0% 100% 0% 0%)" },
            { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, stagger: 0.08, ease: "power2.out", clearProps: "clipPath,transform" },
            0.55,
          )
          .fromTo(
            "[data-a='submit']",
            { autoAlpha: 0, scale: 0.85 },
            { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2)", clearProps: "transform" },
            "-=0.35",
          );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-a='form-card'], [data-a='form-head'], [data-a='form-body']", { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} aria-labelledby={`${id}-heading`} className={`relative z-10 flex justify-center ${className}`}>
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-520 bg-[radial-gradient(ellipse_48%_62%_at_50%_0%,rgba(253,170,100,0.2)_0%,rgba(253,190,130,0.1)_45%,rgba(255,255,255,0)_100%)]"
        />
      )}

      <div data-a="form-card" className="invisible w-1568 bg-[#fbfbfb] px-101 pt-100 pb-62 max-lg:w-full max-lg:px-24 max-lg:pt-48 max-lg:pb-48">
        <div className="flex items-start gap-162 max-lg:flex-col max-lg:gap-16">
          <div className="shrink-0 overflow-hidden">
            <p data-a="form-head" className="invisible mt-17 flex items-center gap-15 font-bold text-graphite uppercase fs-40 tracking-[-0.02em] max-lg:mt-0 max-lg:fs-28">
              <Image src={`${A}/logo-mark.png`} alt="" width={112} height={85} className="h-33 w-auto max-lg:h-24" />
              Contact us
            </p>
          </div>
          <h2 id={`${id}-heading`} className="font-condensed font-bold text-black uppercase fs-93 leading-[0.71] tracking-[-0.04em] max-lg:fs-58 max-lg:leading-[0.9]">
            <span className="block overflow-hidden pt-[0.18em]">
              <span data-a="form-head" className="invisible block">{heading[0]}</span>
            </span>
            <span className="block overflow-hidden">
              <span data-a="form-head" className="invisible block">{heading[1]}</span>
            </span>
          </h2>
        </div>

        <div data-a="form-body" className="invisible">
          <ContactForm className="mt-21 ml-133 w-1093 max-lg:mt-32 max-lg:ml-0 max-lg:w-full" />
        </div>
      </div>
    </section>
  );
}
