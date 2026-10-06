"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import BrandMark from "@/components/brand/BrandMark";

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

const LABEL = "font-normal text-black/66 uppercase fs-18";
const INPUT = "w-full border-0 border-b-2 border-[#6d6d6d] bg-transparent pt-8 pb-10 text-black fs-18 outline-none focus:border-brand";

function TextField({ name, label, type = "text", autoComplete }: Field) {
  return (
    <label className="flex flex-col">
      <span className={LABEL}>{label}</span>
      <input name={name} type={type} autoComplete={autoComplete} className={INPUT} />
    </label>
  );
}

/** Figma 466:5762 → 466:5990: contact card overlapping the ember footer. */
export default function ContactFooter() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flow-units">
      <section id="contact" aria-labelledby="contact-heading" className="relative z-10 flex justify-center bg-white pt-80">
        <div className="w-1568 bg-[#fbfbfb] px-101 pt-83 pb-62 max-lg:w-full max-lg:px-24 max-lg:pt-48">
          <div className="flex items-start gap-120 max-lg:flex-col max-lg:gap-16">
            <p className="mt-49 flex shrink-0 items-center gap-15 font-bold text-graphite uppercase fs-40 tracking-[-0.02em] max-lg:mt-0">
              <Image src={`${A}/logo-mark.png`} alt="" width={112} height={85} className="h-33 w-auto" />
              Contact us
            </p>
            <h2 id="contact-heading" className="pt-20 font-condensed font-bold text-black uppercase fs-93 leading-[0.71] tracking-[-0.04em] max-lg:leading-[0.85]">
              Ready to upgrade
              <br />
              your space?
            </h2>
          </div>

          <form onSubmit={onSubmit} className="mt-55 ml-133 flex w-1093 flex-col gap-28 max-lg:ml-0 max-lg:w-full">
            {ROWS.map((row, i) => (
              <div key={i} className={`grid gap-x-117 gap-y-28 max-lg:grid-cols-1 ${row.length === 3 ? "grid-cols-3 gap-x-75" : "grid-cols-2"}`}>
                {row.map((f) => (
                  <TextField key={f.name} {...f} />
                ))}
              </div>
            ))}
            <div className="flex items-end gap-60 max-lg:flex-col max-lg:items-stretch">
              <label className="flex flex-1 flex-col">
                <span className={LABEL}>Tell us about your space</span>
                <textarea name="message" rows={2} className={`${INPUT} resize-none`} />
              </label>
              <button
                type="submit"
                className="flex h-56 w-230 shrink-0 items-center justify-center gap-10 rounded-[6px] border border-[#e6e6e6] bg-[#212121] font-medium text-[#fbfbfb] capitalize fs-17 transition-colors hover:bg-brand max-lg:w-full"
              >
                <Image src={`${A}/logo-mark.png`} alt="" width={112} height={85} className="h-31 w-auto" />
                Submit
              </button>
            </div>
            <p role="status" className="min-h-[1lh] font-medium text-brand fs-18">
              {sent ? "Thanks — we’ll be in touch shortly." : ""}
            </p>
          </form>
        </div>
      </section>

      <footer className="bg-ember-radial -mt-180 flex flex-col items-center pt-250 pb-30 text-[#fbfbfb] max-lg:-mt-0 max-lg:pt-60">
        <div className="flex w-1093 items-center justify-between max-lg:w-full max-lg:flex-col max-lg:items-start max-lg:gap-24 max-lg:px-24">
          <BrandMark className="fs-83" wordmarkClassName="text-white" />
          <div className="flex items-center gap-60 font-medium fs-20 max-lg:flex-col max-lg:items-start max-lg:gap-12">
            <a href="mailto:info@vendiq.net" className="flex items-center gap-12 hover:text-sun">
              <span aria-hidden className="size-34 bg-white [mask-image:url(/images/vendiq/icon-mail-mask.png)] [mask-size:100%]" />
              info@vendiq.net
            </a>
            <a href="tel:+16236883769" className="flex items-center gap-12 hover:text-sun">
              <span aria-hidden className="size-32 bg-white [mask-image:url(/images/vendiq/icon-phone-mask.png)] [mask-size:100%]" />
              (623)-688-3769
            </a>
          </div>
        </div>
        <p className="mt-142 font-medium text-[#fcca5a] fs-20 max-lg:mt-48">Copyright © Vend IQ — All Rights Reserved</p>
      </footer>
    </div>
  );
}
