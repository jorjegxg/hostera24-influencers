"use client";

import { useEffect, useRef } from "react";
import { recordPublicScan } from "@/lib/api";

export function RecordScan({ cod }: { cod: string }) {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    recordPublicScan(cod).catch(() => {
      // Ignorăm erori la înregistrare — pagina rămâne vizibilă.
    });
  }, [cod]);

  return null;
}
