"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const FRAME_COUNT = 80;
const PATTERN = (i: number) =>
  `/frames/frame-${String(i).padStart(3, "0")}.webp`;

type Capability = "full" | "lite" | "static";

function framePath(i: number) {
  return PATTERN(Math.max(0, Math.min(FRAME_COUNT - 1, i)));
}

/** Decide what version of the animation we can afford to ship. */
function detectCapability(): Capability {
  if (typeof window === "undefined") return "full";

  const reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduced) return "static";

  const nav = navigator as Navigator & {
    connection?: {
      saveData?: boolean;
      effectiveType?: string;
    };
  };
  const conn = nav.connection;
  if (conn?.saveData) return "lite";
  if (conn?.effectiveType && /^(slow-2g|2g|3g)$/.test(conn.effectiveType)) {
    return "lite";
  }

  return "full";
}

const REVEAL_LINES = [
  { at: 0.2, text: "Nyiss egy jobb napi rutinra." },
  { at: 0.55, text: "Modern wellness, egyszerűbben." },
  { at: 0.85, text: "A Grüni hamarosan érkezik." },
];

export function ScrollAnimation() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [capability, setCapability] = useState<Capability>("full");
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  // Refs for RAF loop state — keep them out of React renders.
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(-1);
  const targetFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const inViewRef = useRef(false);

  useEffect(() => {
    setCapability(detectCapability());
  }, []);

  // --- Preload frames (full mode only) ---
  useEffect(() => {
    if (capability !== "full") return;

    const images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(
      null
    );
    imagesRef.current = images;

    let cancelled = false;
    let loadedCount = 0;

    // Priority: load every 4th frame first (20 anchor frames), then fill in.
    const order: number[] = [];
    for (let i = 0; i < FRAME_COUNT; i += 4) order.push(i);
    for (let i = 0; i < FRAME_COUNT; i++) {
      if (!order.includes(i)) order.push(i);
    }

    const loadOne = (index: number) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.decoding = "async";
        img.src = framePath(index);
        img.onload = () => {
          if (cancelled) return resolve();
          images[index] = img;
          loadedCount++;
          // Flip ready once the first anchor batch is in.
          if (!cancelled && loadedCount >= 8 && !ready) {
            setReady(true);
          }
          resolve();
        };
        img.onerror = () => resolve();
      });

    (async () => {
      // First pass — anchors (fast-first so user sees movement).
      await Promise.all(order.slice(0, 20).map(loadOne));
      if (cancelled) return;
      // Second pass — the rest, sequentially to keep network polite.
      for (const idx of order.slice(20)) {
        if (cancelled) return;
        await loadOne(idx);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capability]);

  // --- Canvas sizing + draw loop ---
  useEffect(() => {
    if (capability !== "full") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      currentFrameRef.current = -1; // force redraw
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const target = targetFrameRef.current;
      if (target !== currentFrameRef.current) {
        // Snap to the nearest loaded frame if the exact one isn't ready yet.
        const imgs = imagesRef.current;
        let idx = target;
        if (!imgs[idx]) {
          for (let offset = 1; offset < FRAME_COUNT; offset++) {
            if (imgs[target - offset]) {
              idx = target - offset;
              break;
            }
            if (imgs[target + offset]) {
              idx = target + offset;
              break;
            }
          }
        }
        const img = imgs[idx];
        if (img) {
          const w = canvas.clientWidth;
          const h = canvas.clientHeight;
          ctx.clearRect(0, 0, w, h);
          // Contain-fit the image inside the canvas.
          const ir = img.width / img.height;
          const cr = w / h;
          let dw: number, dh: number, dx: number, dy: number;
          if (ir > cr) {
            dw = w;
            dh = w / ir;
            dx = 0;
            dy = (h - dh) / 2;
          } else {
            dh = h;
            dw = h * ir;
            dx = (w - dw) / 2;
            dy = 0;
          }
          ctx.drawImage(img, dx, dy, dw, dh);
          currentFrameRef.current = idx;
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [capability]);

  // --- Scroll → progress + target frame ---
  useEffect(() => {
    if (capability === "static") return;
    const section = sectionRef.current;
    if (!section) return;

    // Only read scroll when the section is visible.
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(section);

    let ticking = false;
    const update = () => {
      ticking = false;
      if (!inViewRef.current) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) return;
      const raw = -rect.top / total;
      const p = Math.max(0, Math.min(1, raw));
      setProgress(p);
      targetFrameRef.current = Math.round(p * (FRAME_COUNT - 1));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [capability]);

  // --- Static fallback (reduced-motion): just show the end frame ---
  if (capability === "static") {
    return (
      <StaticFallback
        caption="A Grüni hamarosan érkezik."
        src="/images/animation-final.jpg"
      />
    );
  }

  return (
    <section
      id="animacio"
      aria-labelledby="animation-title"
      ref={sectionRef}
      className="relative"
      style={{ height: capability === "full" ? "300vh" : "auto" }}
    >
      <h2 id="animation-title" className="sr-only">
        Termékbemutató — Grüni
      </h2>

      {/* Pinned viewport */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-white">
        <div className="container-wide relative grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Text reveals */}
          <ol
            className="order-2 space-y-6 text-center lg:order-1 lg:text-left"
            aria-label="Termékbemutató üzenetek"
          >
            {REVEAL_LINES.map((line, i) => {
              const shown =
                capability === "full" ? progress >= line.at : true;
              return (
                <li
                  key={line.text}
                  className={cn(
                    "font-display text-[26px] leading-tight text-brand-green-deep transition-all duration-500 ease-brand md:text-[36px] lg:text-[44px]",
                    shown
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0"
                  )}
                  style={{
                    transitionDelay: shown ? `${i * 40}ms` : "0ms",
                  }}
                >
                  {`„${line.text}"`}
                </li>
              );
            })}
          </ol>

          {/* Canvas / lite fallback */}
          <div className="order-1 lg:order-2">
            {capability === "full" ? (
              <div className="relative mx-auto aspect-[16/9] w-full max-w-[640px]">
                <canvas
                  ref={canvasRef}
                  className={cn(
                    "h-full w-full transition-opacity duration-500",
                    ready ? "opacity-100" : "opacity-0"
                  )}
                  aria-hidden="true"
                />
                {!ready && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/images/hero-pouch.jpg"
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 640px, 80vw"
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            ) : (
              // Save-Data / slow network — static end-state, lighter than a video
              <div className="relative mx-auto aspect-[16/9] w-full max-w-[640px]">
                <Image
                  src="/images/animation-final.jpg"
                  alt="Grüni gumivitamin — nyitott tasak, szétszórt gumicukrokkal"
                  fill
                  sizes="(min-width: 1024px) 640px, 80vw"
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StaticFallback({
  caption,
  src,
}: {
  caption: string;
  src: string;
}) {
  return (
    <section
      id="animacio"
      aria-labelledby="animation-title"
      className="section-y relative overflow-hidden bg-white"
    >
      <div className="container-wide relative grid items-center gap-10 lg:grid-cols-2">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <h2
            id="animation-title"
            className="font-display text-[32px] leading-tight text-brand-green-deep md:text-[44px]"
          >
            {caption}
          </h2>
          <p className="mt-4 text-body-md text-brand-ink-muted md:text-body-lg">
            Modern wellness, egyszerűbben. Nyiss egy jobb napi rutinra.
          </p>
        </div>
        <div className="relative order-1 mx-auto aspect-[16/9] w-full max-w-[640px] lg:order-2">
          <Image
            src={src}
            alt="Grüni gumivitamin — nyitott tasak, szétszórt gumicukrokkal"
            fill
            sizes="(min-width: 1024px) 640px, 80vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
