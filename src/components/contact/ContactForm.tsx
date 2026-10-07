"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";

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

/** Lead form shared by the homepage contact card and the contact page. */
export default function ContactForm({ className = "" }: { className?: string }) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className={`flex flex-col ${className}`}>
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
  );
}
