import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="pt-20 md:pt-24">
        <article className="container-narrow prose prose-neutral py-16 md:py-24 max-w-3xl">
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
