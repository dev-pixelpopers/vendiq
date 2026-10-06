import IntroHero from "@/components/sections/IntroHero";
import ProductStory from "@/components/sections/ProductStory";
import Industries from "@/components/sections/Industries";
import BrandStory from "@/components/sections/BrandStory";
import Reviews from "@/components/sections/Reviews";
import AdSpace from "@/components/sections/AdSpace";
import ContactFooter from "@/components/sections/ContactFooter";
import TravelMachine from "@/components/scroll/TravelMachine";

export default function Home() {
  return (
    <main className="flex flex-col">
      <IntroHero />
      <ProductStory />
      <Industries />
      <BrandStory />
      <Reviews />
      <AdSpace />
      <ContactFooter />
      {/* One machine image travels hero → product story → industries */}
      <TravelMachine />
    </main>
  );
}
