import { FirmeSection } from "./FirmeSection";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-5xl px-4">
          <FirmeSection />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
