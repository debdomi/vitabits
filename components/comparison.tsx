import { X, Check } from "lucide-react";

const TRADITIONAL = [
  "Nehéz következetesen tartani",
  "Tabletta- vagy kapszulaérzet",
  "Könnyen feledésbe merül",
  "Általában 10–12 összetevő",
];

const VITABITS = [
  "Könnyebben beilleszthető a napodba",
  "Élvezetes, modern forma",
  "Egyszerűbbé teszi a következetességet",
  "50+ összetevő — vitaminok, ásványi anyagok, növényi kivonatok",
];

export function Comparison() {
  return (
    <section
      id="osszetevok"
      aria-labelledby="comparison-title"
      className="section-y bg-white"
    >
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <p className="kicker mb-3">Összehasonlítás</p>
          <h2
            id="comparison-title"
            className="font-display text-[32px] leading-[1.1] text-brand-green-deep md:text-[44px]"
          >
            Miért Vitabits a hagyományos megoldások helyett?
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-6">
          {/* Traditional column — muted */}
          <article
            aria-labelledby="col-traditional"
            className="rounded-card border border-brand-green/15 bg-brand-green-tint p-6 md:p-8"
          >
            <h3
              id="col-traditional"
              className="font-display text-xl font-semibold text-brand-ink md:text-2xl"
            >
              Hagyományos vitaminok
            </h3>
            <ul role="list" className="mt-5 space-y-3">
              {TRADITIONAL.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-body-md text-brand-ink-muted"
                >
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-ink-muted/15">
                    <X
                      className="h-3 w-3 text-brand-ink-muted"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          {/* Vitabits column — green gradient, elevated */}
          <article
            aria-labelledby="col-vitabits"
            className="relative overflow-hidden rounded-card bg-[#0d591f] p-6 text-white shadow-cta md:p-8"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
            />
            <h3
              id="col-vitabits"
              className="relative font-display text-xl font-semibold md:text-2xl"
            >
              Vitabits élmény
            </h3>
            <ul role="list" className="relative mt-5 space-y-3">
              {VITABITS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-body-md"
                >
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-brand-green-deep">
                    <Check
                      className="h-3 w-3"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-white/95">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-body-md text-brand-ink-muted md:text-body-lg">
          A Vitabits nem csak egy újabb étrend-kiegészítő. Egy új, könnyebben
          tartható napi rutin kezdete.
        </p>
      </div>
    </section>
  );
}
