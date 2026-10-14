import ContactFormSection from "@/components/contact/ContactFormSection";
import SiteFooter from "@/components/sections/SiteFooter";

/**
 * Figma 466:5762 → 466:5990: the contact card on white (revealed on scroll),
 * then over the last stretch of scroll the ember footer wipes up from the
 * bottom behind it.
 */
export default function ContactFooter() {
  return (
    <div className="flow-units">
      <ContactFormSection id="contact" heading={["Ready to upgrade", "your space?"]} className="pt-225 max-lg:pt-80" glow />
      <SiteFooter className="-mt-180 pt-250 max-lg:-mt-0 max-lg:pt-60" />
    </div>
  );
}
