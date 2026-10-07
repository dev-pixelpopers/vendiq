"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const A = "/images/vendiq";

type Detail = {
  label: string;
  value: string;
  body: string;
  icon: ReactNode;
  action: { href: string; text: string };
  /** Text copied by the copy button, when the card has one. */
  copy?: string;
};

const maskIcon = (src: string) => (
  <span
    aria-hidden
    className="size-40 bg-brand transition-colors duration-300 group-hover:bg-white group-focus-within:bg-white"
    style={{ maskImage: `url(${src})`, maskSize: "100%", WebkitMaskImage: `url(${src})`, WebkitMaskSize: "100%" }}
  />
);

const DETAILS: Detail[] = [
  {
    label: "Email us",
    value: "Info@Vendiq.Net",
    body: "Send your space details, photos or questions and we’ll reply with next steps.",
    icon: maskIcon(`${A}/icon-mail-mask.png`),
    action: { href: "mailto:info@vendiq.net", text: "Send an email" },
    copy: "info@vendiq.net",
  },
  {
    label: "Call us",
    value: "(623)-688-3769",
    body: "Prefer to talk it through? Give us a call and speak with the VendIQ team.",
    icon: maskIcon(`${A}/icon-phone-mask.png`),
    action: { href: "tel:+16236883769", text: "Call now" },
    copy: "(623) 688-3769",
  },
  {
    label: "Where we work",
    value: "Arizona",
    body: "Residential communities, fitness facilities and commercial spaces across Arizona.",
    icon: <Image src={`${A}/logo-mark.png`} alt="" width={112} height={85} className="h-30 w-auto" />,
    action: { href: "#contact-form", text: "Request a machine" },
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked: the value is still visible to select by hand.
    }
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      className="relative z-10 rounded-full border border-[#dadada] px-20 py-8 font-medium fs-16 transition-colors group-hover:border-white/40 hover:bg-white hover:text-[#0f0f0f] max-lg:px-28 max-lg:py-12"
    >
      <span aria-live="polite">{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

function DetailCard({ d }: { d: Detail }) {
  return (
    <article
      data-a="detail-card"
      className="group invisible relative isolate flex min-h-440 flex-col overflow-hidden rounded-[20px] border border-[#eaeaea] bg-white px-44 pt-44 pb-40 text-black transition-[border-color,translate] duration-300 hover:-translate-y-8 hover:border-transparent max-lg:min-h-0"
    >
      {/* Ember fill wipes up on hover / keyboard focus */}
      <span
        aria-hidden
        className="bg-ember-linear absolute inset-0 -z-10 transition-[clip-path] duration-500 ease-out [clip-path:inset(100%_0%_0%_0%)] group-focus-within:[clip-path:inset(0%_0%_0%_0%)] group-hover:[clip-path:inset(0%_0%_0%_0%)]"
      />
      <span className="grid size-84 place-items-center rounded-full bg-[#fff1e8] transition-colors duration-300 group-hover:bg-white/15 group-focus-within:bg-white/15 max-lg:size-110">
        {d.icon}
      </span>
      <p className="mt-40 font-normal text-[#3d3d3d] uppercase fs-18 tracking-[0.02em] transition-colors duration-300 group-hover:text-white/70 group-focus-within:text-white/70">
        {d.label}
      </p>
      <h3 className="mt-8 font-condensed font-bold fs-56 leading-none tracking-[-0.02em] transition-colors duration-300 group-hover:text-sun group-focus-within:text-sun">
        {d.value}
      </h3>
      <p className="mt-18 font-normal fs-18 leading-[1.4] tracking-[-0.02em] text-[#3d3d3d] transition-colors duration-300 group-hover:text-white/85 group-focus-within:text-white/85">
        {d.body}
      </p>
      <div className="mt-auto flex items-center justify-between gap-16 pt-36 transition-colors duration-300 group-hover:text-white group-focus-within:text-white">
        <a href={d.action.href} className="flex items-center gap-10 font-medium capitalize fs-18 underline-offset-4 hover:underline">
          {d.action.text}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-6">→</span>
        </a>
        {d.copy && <CopyButton text={d.copy} />}
      </div>
    </article>
  );
}

/** Three contact routes as cards; the ember fill from the homepage wipes up on hover. */
export default function ContactDetails() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-a='details-head']",
          { autoAlpha: 0, yPercent: 110 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: { trigger: root.current, start: "top 75%" },
          },
        );
        gsap.fromTo(
          "[data-a='detail-card']",
          { autoAlpha: 0, y: 120 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            stagger: 0.12,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: { trigger: "[data-a='detail-grid']", start: "top 85%" },
          },
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-a='details-head'], [data-a='detail-card']", { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="details-heading" className="flow-units relative pt-200 max-lg:pt-100">
      {/* Soft peach glow (decorative) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-520 bg-[radial-gradient(ellipse_48%_62%_at_50%_0%,rgba(253,170,100,0.2)_0%,rgba(253,190,130,0.1)_45%,rgba(255,255,255,0)_100%)]"
      />

      <div className="mx-auto w-1568 max-lg:w-full max-lg:px-24">
        <header className="flex items-end gap-162 max-lg:flex-col max-lg:items-start max-lg:gap-12">
          <div className="overflow-hidden">
            <p data-a="details-head" className="invisible flex shrink-0 items-center gap-15 pb-12 font-bold text-graphite uppercase fs-40 tracking-[-0.02em]">
              <Image src={`${A}/logo-mark.png`} alt="" width={112} height={85} className="h-33 w-auto" />
              Contact details
            </p>
          </div>
          <div className="overflow-hidden">
            <h2
              id="details-heading"
              data-a="details-head"
              className="invisible pt-8 font-condensed font-bold text-black uppercase fs-93 leading-[0.825] tracking-[-0.04em]"
            >
              We’re one tap away
            </h2>
          </div>
        </header>

        <div data-a="detail-grid" className="mt-84 grid grid-cols-3 gap-29 max-lg:mt-40 max-lg:grid-cols-1 max-lg:gap-20">
          {DETAILS.map((d) => (
            <DetailCard key={d.label} d={d} />
          ))}
        </div>
      </div>
    </section>
  );
}
