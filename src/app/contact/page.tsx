import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactDetails from "@/components/contact/ContactDetails";
import ContactSteps from "@/components/contact/ContactSteps";
import ContactFormSection from "@/components/contact/ContactFormSection";
import SiteFooter from "@/components/sections/SiteFooter";

export const metadata: Metadata = {
  title: "Contact — VendIQ",
  description: "Request a VendIQ smart vending machine for your space, or reach the team by email or phone.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-col">
      <ContactHero />
      <ContactDetails />
      <ContactSteps />
      <div className="flow-units">
        <ContactFormSection />
        <SiteFooter className="-mt-180 pt-250 max-lg:-mt-0 max-lg:pt-60" />
      </div>
    </main>
  );
}
