import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { NatureStrip } from "@/components/nature-strip";
import { Benefits } from "@/components/benefits";
import { Comparison } from "@/components/comparison";
import { BrandStory } from "@/components/brand-story";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { StickyCta } from "@/components/sticky-cta";
import { ScrollAnimation } from "@/components/scroll-animation";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="pt-20 md:pt-24">
        <Hero />
        <NatureStrip />
        <Benefits />
        <ScrollAnimation />
        <Comparison />
        <BrandStory />
        <Faq />
        <FinalCta />
      </main>
      <StickyCta />
      <SiteFooter />
    </>
  );
}
