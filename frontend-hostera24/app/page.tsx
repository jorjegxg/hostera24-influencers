"use client";

import { useState } from "react";
import { AgentiiSection } from "./components/AgentiiSection";
import { FirmeSection } from "./components/FirmeSection";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export default function Home() {
  const [audience, setAudience] = useState<"firme" | "agentii">("firme");

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader audience={audience} onAudienceChange={setAudience} />
      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-5xl px-4">
          <div hidden={audience !== "firme"}>
            <FirmeSection />
          </div>
          <div hidden={audience !== "agentii"}>
            <AgentiiSection />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
