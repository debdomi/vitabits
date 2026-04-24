import Image from "next/image";
import { WaitlistForm } from "@/components/waitlist-form";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-gradient-b"
    >
      {/* Soft green glow in the background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-a-radial"
      />

      <div className="container-wide relative pt-10 pb-14 md:pt-20 md:pb-24 lg:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:gap-16">
          {/* Copy + form */}
          <div className="text-center lg:text-left">
            <p className="kicker animate-fade-up">Új generációs gumivitamin</p>
            <h1
              id="hero-title"
              className="mt-4 font-display text-h1-mobile text-brand-green-deep text-balance md:text-h1 animate-fade-up"
              style={{ animationDelay: "60ms" }}
            >
              A napi vitamin, amit tényleg{" "}
              <span className="inline-block -rotate-6 text-[#20df4d]">
                jó
              </span>{" "}
              beépíteni a rutinodba.
            </h1>
            <p
              className="mx-auto mt-5 max-w-xl text-body-md text-brand-ink-muted md:text-body-lg lg:mx-0 animate-fade-up"
              style={{ animationDelay: "120ms" }}
            >
              50+ összetevő — vitaminok, ásványi anyagok és növényi kivonatok —
              egyetlen ízletes gumivitaminban. Egyszerűbb, finomabb,
              követhetőbb.
            </p>

            <div
              className="mx-auto mt-8 max-w-xl lg:mx-0 animate-fade-up"
              style={{ animationDelay: "180ms" }}
            >
              <WaitlistForm source="hero" />
            </div>
          </div>

          {/* Product visual */}
          <div className="relative mx-auto w-full max-w-[520px] animate-fade-up lg:max-w-none"
               style={{ animationDelay: "240ms" }}>
            <ProductPlinth />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductPlinth() {
  return (
    <div className="relative aspect-[4/3] w-full">
      {/* Soft green glow behind the frame */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-[32px] bg-gradient-a opacity-25 blur-3xl"
      />
      <div className="relative h-full w-full overflow-hidden rounded-card shadow-cta ring-1 ring-brand-green/10 motion-safe:animate-float-y">
        <Image
          src="/images/hero-shot.png"
          alt="Vitabits grüni gumivitamin — elégedett vásárló a tasakkal a konyhában"
          fill
          priority
          sizes="(min-width: 1024px) 520px, (min-width: 640px) 80vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
