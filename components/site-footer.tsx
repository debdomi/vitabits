import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";

const LEGAL = [
  { href: "/adatvedelem", label: "Adatvédelmi tájékoztató" },
  { href: "/aszf", label: "ÁSZF" },
  { href: "/impresszum", label: "Impresszum" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

const SOCIALS = [
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
  { href: "https://youtube.com", label: "YouTube", Icon: Youtube },
  { href: "https://tiktok.com", label: "TikTok", Icon: TikTokIcon },
  { href: "https://pinterest.com", label: "Pinterest", Icon: PinterestIcon },
  { href: "https://snapchat.com", label: "Snapchat", Icon: SnapchatIcon },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-surface text-brand-green-deep">
      <div className="container-wide py-12 md:py-16">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <a
            href="#"
            aria-label="Vissza a tetejére"
            className="inline-block shrink-0 rounded-btn focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-green-deep focus-visible:ring-offset-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="Vitabits"
              width={2400}
              height={1340}
              className="h-16 w-auto select-none md:h-24"
              draggable={false}
            />
          </a>
          <ul className="flex flex-wrap items-center gap-5">
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-green-deep transition-colors hover:bg-white/40"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-brand-green-deep/15 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="underline-offset-4 hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-brand-green-deep/80">© 2026 Vitabits</p>
        </div>
      </div>
    </footer>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.6 6.3c-1.3-.2-2.4-1-3-2.1-.3-.5-.4-1-.5-1.6h-3v12.4a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .9.1V9.3c-.3 0-.6-.1-.9-.1a5.8 5.8 0 1 0 5.8 5.8V9.7a7 7 0 0 0 4 1.3V8a4.6 4.6 0 0 1-.6-1.7Z" />
    </svg>
  );
}

function PinterestIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12a10 10 0 0 0 6.44 9.35c-.09-.8-.17-2.02.04-2.9.19-.79 1.22-5.03 1.22-5.03s-.31-.62-.31-1.54c0-1.45.84-2.53 1.88-2.53.89 0 1.32.67 1.32 1.47 0 .9-.57 2.23-.87 3.47-.25 1.04.52 1.88 1.54 1.88 1.85 0 3.27-1.95 3.27-4.76 0-2.49-1.79-4.23-4.34-4.23-2.96 0-4.69 2.22-4.69 4.51 0 .89.34 1.85.77 2.37.08.1.1.19.07.3-.08.34-.27 1.04-.3 1.19-.05.19-.16.24-.36.14-1.34-.62-2.18-2.58-2.18-4.15 0-3.38 2.46-6.49 7.09-6.49 3.72 0 6.61 2.65 6.61 6.2 0 3.7-2.33 6.67-5.57 6.67-1.09 0-2.11-.57-2.46-1.23l-.67 2.56c-.24.94-.9 2.12-1.34 2.84A10 10 0 1 0 12 2Z" />
    </svg>
  );
}

function SnapchatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.2c2.6 0 5 1.5 5 5v3.2c.4.2.9.3 1.3.3.5 0 1-.2 1.2-.6.2-.4.7-.4 1-.2.3.2.4.6.2.9-.4.7-1.3 1.2-2.4 1.2-.2 0-.5 0-.7-.1.3.7.7 1.3 1.2 1.8.5.5 1.2.8 1.9 1 .3.1.5.4.4.7-.1.2-.3.4-.5.5-.8.3-1.6.5-2.4.6-.1.3-.3.7-.5 1-.2.2-.5.3-.8.3-.6 0-1.2-.3-2.1-.3-1 0-1.6.2-2.3.5-.8.4-1.5.9-2.3.9-.8 0-1.5-.5-2.3-.9-.7-.3-1.3-.5-2.3-.5-.9 0-1.5.3-2.1.3-.3 0-.6-.1-.8-.3-.2-.3-.4-.7-.5-1-.8-.1-1.6-.3-2.4-.6-.2-.1-.4-.3-.5-.5-.1-.3.1-.6.4-.7.7-.2 1.4-.5 1.9-1 .5-.5.9-1.1 1.2-1.8-.2.1-.5.1-.7.1-1.1 0-2-.5-2.4-1.2-.2-.3-.1-.7.2-.9.3-.2.8-.2 1 .2.2.4.7.6 1.2.6.4 0 .9-.1 1.3-.3V7.2c0-3.5 2.4-5 5-5z" />
    </svg>
  );
}
