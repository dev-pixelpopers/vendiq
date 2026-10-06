"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BrandMark from "@/components/brand/BrandMark";
import { jumpToScroll } from "@/components/scroll/ScrollScene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const A = "/images/vendiq";

type Field = { name: string; label: string; type?: string; autoComplete?: string };

const ROWS: Field[][] = [
  [
    { name: "firstName", label: "First name", autoComplete: "given-name" },
    { name: "lastName", label: "Last name", autoComplete: "family-name" },
  ],
  [
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
    { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  ],
  [
    { name: "company", label: "Company", autoComplete: "organization" },
    { name: "businessType", label: "Business type" },
    { name: "location", label: "Location", autoComplete: "address-level2" },
  ],
];

/**
 * The label rests inside the field just above its line (Figma); on focus or
 * once filled it shrinks to the top so the typed value has room.
 */
const LABEL =
  "pointer-events-none absolute left-6 origin-left font-normal text-[#3d3d3d] uppercase fs-18 tracking-[0.02em] transition-transform duration-200 " +
  "peer-focus:-translate-y-26 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-26 peer-[:not(:placeholder-shown)]:scale-75";
const INPUT = "peer w-full bg-transparent px-6 text-black fs-18 outline-none";

function TextField({ name, label, type = "text", autoComplete }: Field) {
  return (
    <label className="relative flex flex-col">
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder=" "
        className={`${INPUT} h-58 border-0 border-b-2 border-[#6d6d6d] pt-22 pb-8 focus:border-brand`}
      />
      <span className={`${LABEL} bottom-21`}>{label}</span>
    </label>
  );
}

/** Scroll (Figma px) over which the footer rises in: 466:5762 → 466:5990. */
const FOOTER_RISE = 280;

/**
 * Figma 466:5762 → 466:5990: the contact card on white, then over the last
 * stretch of scroll the ember footer wipes up from the bottom behind it.
 */
export default function ContactFooter() {
  const [sent, setSent] = useState(false);
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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flow-units">
      <section id="contact" aria-labelledby="contact-heading" className="relative z-10 flex justify-center pt-225 max-lg:pt-80">
        {/* Soft peach glow above the card (decorative) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-520 bg-[radial-gradient(ellipse_48%_62%_at_50%_0%,rgba(253,170,100,0.2)_0%,rgba(253,190,130,0.1)_45%,rgba(255,255,255,0)_100%)]"
        />

        <div className="w-1568 bg-[#fbfbfb] px-101 pt-100 pb-62 max-lg:w-full max-lg:px-24 max-lg:pt-48">
          <div className="flex items-start gap-162 max-lg:flex-col max-lg:gap-16">
            <p className="mt-17 flex shrink-0 items-center gap-15 font-bold text-graphite uppercase fs-40 tracking-[-0.02em] max-lg:mt-0">
              <Image src={`${A}/logo-mark.png`} alt="" width={112} height={85} className="h-33 w-auto" />
              Contact us
            </p>
            <h2 id="contact-heading" className="font-condensed font-bold text-black uppercase fs-93 leading-[0.71] tracking-[-0.04em] max-lg:leading-[0.85]">
              <span className="block pt-[0.18em]">Ready to upgrade</span>
              <span className="block">your space?</span>
            </h2>
          </div>

          <form onSubmit={onSubmit} className="mt-21 ml-133 flex w-1093 flex-col max-lg:ml-0 max-lg:w-full">
            {ROWS.map((row, i) => (
              <div
                key={i}
                className={`grid gap-y-26 max-lg:grid-cols-1 ${i > 0 ? (i === 2 ? "mt-51" : "mt-26") : ""} ${row.length === 3 ? "grid-cols-3 gap-x-75" : "grid-cols-2 gap-x-117"}`}
              >
                {row.map((f) => (
                  <TextField key={f.name} {...f} />
                ))}
              </div>
            ))}

            <div className="relative mt-34 flex items-start gap-60 max-lg:flex-col max-lg:items-stretch">
              <label className="relative flex flex-1 flex-col">
                <textarea
                  name="message"
                  rows={2}
                  placeholder=" "
                  className={`${INPUT} min-h-58 resize-none border-0 border-b-2 border-transparent pt-22 pb-8 focus:border-brand`}
                />
                <span className={`${LABEL} top-22`}>Tell us about your space</span>
              </label>
              <button
                type="submit"
                className="mt-39 flex h-54 w-228 shrink-0 items-center justify-center gap-10 rounded-[4px] bg-[#212121] font-medium text-[#fbfbfb] capitalize fs-17 transition-colors hover:bg-brand max-lg:w-full"
              >
                <Image src={`${A}/logo-mark.png`} alt="" width={112} height={85} className="h-31 w-auto" />
                Submit
              </button>
              <p role="status" className="absolute top-full right-0 mt-12 font-medium text-brand fs-16 max-lg:static">
                {sent ? "Thanks — we’ll be in touch shortly." : ""}
              </p>
            </div>
          </form>
        </div>
      </section>

      <footer ref={footer} className="relative isolate -mt-180 flex flex-col items-center pt-250 pb-25 text-[#fbfbfb] max-lg:-mt-0 max-lg:pt-60">
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
    </div>
  );
}
