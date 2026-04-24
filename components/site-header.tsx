"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#elonyok", label: "Előnyök" },
  { href: "#osszetevok", label: "Összetevők" },
  { href: "#gyik", label: "GYIK" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-200 ease-brand",
        scrolled
          ? "bg-brand-surface/88 backdrop-blur-md supports-[not_(backdrop-filter:blur(0))]:bg-brand-surface"
          : "bg-brand-surface/80 backdrop-blur-md supports-[not_(backdrop-filter:blur(0))]:bg-brand-surface"
      )}
    >
      <div className="container-wide flex h-20 items-center justify-between md:h-24">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Vitabits — főoldal"
        >
          <Wordmark />
        </Link>

        <nav
          aria-label="Főmenü"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[15px] font-medium text-brand-green-deep transition-colors hover:text-brand-green"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex"
            aria-label="Csatlakozz a várólistához"
          >
            <a href="#final-cta">Csatlakozz a várólistához</a>
          </Button>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-btn text-brand-green-deep md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        className={cn(
          "fixed inset-x-0 top-20 z-40 overflow-hidden bg-brand-surface shadow-card transition-[max-height] duration-300 ease-brand md:hidden",
          open ? "max-h-[80vh]" : "max-h-0"
        )}
      >
        <nav
          aria-label="Mobil menü"
          className="container-wide flex flex-col gap-2 py-6"
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-btn px-4 py-3 text-lg font-medium text-brand-green-deep hover:bg-white/40"
            >
              {l.label}
            </a>
          ))}
          <Button asChild size="lg" className="mt-3 w-full">
            <a href="#final-cta" onClick={() => setOpen(false)}>
              Csatlakozz a várólistához
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function Wordmark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo.png"
      alt="Vitabits"
      className="h-16 w-auto shrink-0 select-none md:h-20"
      draggable={false}
    />
  );
}
