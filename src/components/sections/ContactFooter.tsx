import Image from "next/image";
import ContactForm from "@/components/contact/ContactForm";
import SiteFooter from "@/components/sections/SiteFooter";

const A = "/images/vendiq";

/**
 * Figma 466:5762 → 466:5990: the contact card on white, then over the last
 * stretch of scroll the ember footer wipes up from the bottom behind it.
 */
export default function ContactFooter() {
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

          <ContactForm className="mt-21 ml-133 w-1093 max-lg:ml-0 max-lg:w-full" />
        </div>
      </section>

      <SiteFooter className="-mt-180 pt-250 max-lg:-mt-0 max-lg:pt-60" />
    </div>
  );
}
