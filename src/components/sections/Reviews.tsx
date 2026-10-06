"use client";

import Image from "next/image";
import ScrollScene, { FRAME, type SceneBuilder } from "@/components/scroll/ScrollScene";

const A = "/images/vendiq";

type Review = {
  title: string;
  quote: string;
  name: string;
  org: string;
  avatar: string;
  logo: { src: string; width: number; height: number; className: string };
};

const FITNESS: Review = {
  title: "Simple for our members. Smart for our space",
  quote: "The technology is what really stood out to us. Customers can simply tap, take what they need, and go. It’s a much more modern vending experience.",
  name: "Fitness Facility Manager",
  org: "24/7 Fitness Arizona",
  avatar: "avatar-fitness.webp",
  logo: { src: "client-logo-b.png", width: 182, height: 90, className: "h-45 opacity-70" },
};

const PROPERTY: Review = {
  title: "A seamless experience from day one",
  quote: "Vend IQ made the entire process incredibly straightforward. The machine looks great in our space, and the tap-to-pay experience has been a real upgrade for our residents.",
  name: "Property Manager",
  org: "Multi-Family Community, Arizona",
  avatar: "avatar-property.webp",
  logo: { src: "client-logo-c.png", width: 302, height: 80, className: "h-40" },
};

const COMMUNITY: Review = {
  title: "It feels like a premium amenity",
  quote: "Our residents wanted convenient access to snacks and drinks, but we didn’t want something that looked like a traditional vending machine. Vend IQ fits the space perfectly and is incredibly easy to use.",
  name: "Community Manager",
  org: "Residential Community, Arizona",
  avatar: "avatar-community.webp",
  logo: { src: "client-logo-a.png", width: 250, height: 70, className: "h-35" },
};

const TRACK: Review[] = [FITNESS, PROPERTY, COMMUNITY, FITNESS, PROPERTY, COMMUNITY, FITNESS];

function ReviewCard({ r }: { r: Review }) {
  return (
    <article
      data-a="review"
      className="invisible flex h-541 w-448 shrink-0 flex-col rounded-[10px] border border-[#eaeaea] bg-white px-28 pt-21 pb-32 text-black capitalize"
    >
      <div className="flex items-start justify-between">
        <Image src={`${A}/${r.avatar}`} alt="" width={184} height={184} className="size-92 rounded-full object-cover" />
        <div className="mt-16 flex h-57 w-178 items-center justify-center rounded-full border border-[#dadada] bg-white">
          <Image src={`${A}/${r.logo.src}`} alt="" width={r.logo.width} height={r.logo.height} className={`w-auto ${r.logo.className}`} />
        </div>
      </div>
      <Image src={`${A}/quote-mark.png`} alt="" width={96} height={80} className="mt-63 h-40 w-48" />
      <h3 className="mt-37 w-301 font-bold fs-24 leading-none tracking-[-0.02em]">{r.title}</h3>
      <p className="mt-42 w-389 font-normal fs-18 leading-[1.333] tracking-[-0.02em]">{r.quote}</p>
      <p className="mt-auto font-medium fs-18 leading-[1.333] tracking-[-0.02em]">{r.name}</p>
      <p className="font-light italic fs-16 leading-[1.5] tracking-[-0.02em]">{r.org}</p>
    </article>
  );
}

/** Figma 466:4716 → 466:5019. Header reveals, then the card track scrubs left. */
const build: SceneBuilder = (tl) => {
  tl.fromTo("[data-a='glow']", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 })
    .fromTo("[data-a='reviews-head']", { autoAlpha: 0, yPercent: 110 }, { autoAlpha: 1, yPercent: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }, 0.2)
    .fromTo("[data-a='review']", { autoAlpha: 0, y: 120 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "power2.out" }, 0.6)
    // 970 Figma px of travel across a 3310 px track.
    .to("[data-a='review-track']", { xPercent: -29.3, duration: 4 }, "+=0.2")
    .to({}, { duration: 0.6 });
};

export default function Reviews() {
  return (
    <ScrollScene id="reviews" label="Client reviews" trackClassName="h-[450vh]" stageClassName="bg-white" build={build}>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image data-a="glow" src={`${A}/glow-sun.svg`} alt="" width={2526} height={2526} className="invisible absolute top-[-102%] left-[-21%] w-[127%] max-w-none opacity-60" />
        <Image data-a="glow" src={`${A}/glow-orange.svg`} alt="" width={2526} height={2526} className="invisible absolute top-[-112%] left-[-40%] w-[127%] max-w-none opacity-60" />
      </div>

      <div className={`${FRAME} flex flex-col max-lg:[--spacing:calc(100vw/520)] max-lg:[--u:calc(100vw/520)]`}>
        <header className="flex items-end gap-179 pt-205 pl-132 max-lg:flex-col max-lg:items-start max-lg:gap-12 max-lg:px-36 max-lg:pt-120">
          <div className="overflow-hidden">
            <p data-a="reviews-head" className="invisible flex items-center gap-15 pb-12 font-bold text-graphite uppercase fs-40 tracking-[-0.02em]">
              <Image src={`${A}/logo-mark.png`} alt="" width={112} height={85} className="h-33 w-auto" />
              Client reviews
            </p>
          </div>
          <div className="overflow-hidden">
            <h2 data-a="reviews-head" className="invisible pt-8 font-condensed font-bold text-black capitalize fs-93.25 leading-[0.825] tracking-[-0.04em]">
              Real stories, real results
            </h2>
          </div>
        </header>

        <div className="relative mt-84 max-lg:mt-48">
          <div data-a="review-track" className="-ml-265 flex w-max gap-29 max-lg:ml-36">
            {TRACK.map((r, i) => (
              <ReviewCard key={i} r={r} />
            ))}
          </div>
          {/* Edge fades (overlay) */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-168 bg-gradient-to-r from-white to-white/0" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-245 bg-gradient-to-l from-white to-white/0" />
        </div>
      </div>
    </ScrollScene>
  );
}
