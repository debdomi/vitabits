import { Smile, CalendarCheck, Sparkles } from "lucide-react";

const CARDS = [
  {
    Icon: Smile,
    title: "Élvezetesebb napi rutin",
    body:
      "Nem még egy kötelező kapszula. A Vitabits úgy készült, hogy a napi rutin kényelmesebb és kellemesebb legyen.",
  },
  {
    Icon: CalendarCheck,
    title: "Könnyebb tartani",
    body:
      "kevesebb nehézség, több következetesség. Egy rutin akkor működik, ha könnyű tartani — otthon, útközben, reggel vagy délután.",
  },
  {
    Icon: Sparkles,
    title: "Tudatosabb összetétel",
    body:
      "50+ átgondolt összetevő — vitaminok, ásványi anyagok és növényi kivonatok — egyetlen ízletes formában.",
  },
];

export function Benefits() {
  return (
    <section
      id="elonyok"
      aria-labelledby="benefits-title"
      className="section-y bg-white"
    >
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <p className="kicker mb-3">Előnyök</p>
          <h2
            id="benefits-title"
            className="font-display text-[32px] leading-[1.1] text-brand-green-deep md:text-[44px]"
          >
            Miért lesz más a Vitabits?
          </h2>
          <p className="mt-4 text-body-md text-brand-ink-muted md:text-body-lg">
            A legtöbb étrend-kiegészítő túl bonyolult vagy túl unalmas ahhoz,
            hogy hosszú távon a napi rutin része maradjon. A Vitabits ezt teszi
            egyszerűbbé és szerethetőbbé.
          </p>
        </div>

        <ul
          role="list"
          className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6"
        >
          {CARDS.map(({ Icon, title, body }) => (
            <li
              key={title}
              className="group flex flex-col items-center rounded-card border-[1.5px] border-brand-green/25 bg-white p-6 text-center shadow-card transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:border-brand-green/50 hover:shadow-[0_12px_32px_rgba(15,26,16,0.08)] md:p-7"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-btn bg-brand-surface text-brand-green-deep">
                <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-brand-green-deep md:text-[22px]">
                {title}
              </h3>
              <p className="mt-2 text-body-md text-brand-ink-muted">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
