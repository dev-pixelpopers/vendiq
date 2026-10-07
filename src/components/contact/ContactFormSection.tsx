"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContactForm from "@/components/contact/ContactForm";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const A = "/images/vendiq";

/** The homepage contact card, given its own reveal: heading lines rise, then the fields. */
export default function ContactFormSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 70%" } })
          .fromTo("[data-a='form-head']", { autoAlpha: 0, yPercent: 110 }, { autoAlpha: 1, yPercent: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" })
          .fromTo("[data-a='form-body']", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.3);
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-a='form-head'], [data-a='form-body']", { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="contact-form"
      aria-labelledby="form-heading"
      className="relative z-10 flex scroll-mt-40 justify-center pt-200 max-lg:pt-100"
    >
      <div className="w-1568 bg-[#fbfbfb] px-101 pt-100 pb-62 max-lg:w-full max-lg:px-24 max-lg:pt-48">
        <div className="flex items-start gap-162 max-lg:flex-col max-lg:gap-16">
          <div className="overflow-hidden">
            <p data-a="form-head" className="invisible mt-17 flex shrink-0 items-center gap-15 font-bold text-graphite uppercase fs-40 tracking-[-0.02em] max-lg:mt-0">
              <Image src={`${A}/logo-mark.png`} alt="" width={112} height={85} className="h-33 w-auto" />
              Contact us
            </p>
          </div>
          <h2 id="form-heading" className="font-condensed font-bold text-black uppercase fs-93 leading-[0.71] tracking-[-0.04em] max-lg:leading-[0.85]">
            <span className="block overflow-hidden pt-[0.18em]">
              <span data-a="form-head" className="invisible block">Request a machine</span>
            </span>
            <span className="block overflow-hidden">
              <span data-a="form-head" className="invisible block">for your space</span>
            </span>
          </h2>
        </div>

        <div data-a="form-body" className="invisible">
          <ContactForm className="mt-21 ml-133 w-1093 max-lg:ml-0 max-lg:w-full" />
        </div>
      </div>
    </section>
  );
}
