"use client";

import { QRCodeSVG } from "qrcode.react";

type Props = {
  url: string;
  label?: string;
};

export function CodQrDisplay({ url, label }: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-2xl border border-[var(--color-placeholder-border)] bg-white p-4 shadow-sm">
        <QRCodeSVG
          value={url}
          size={200}
          level="M"
          marginSize={2}
          fgColor="#111111"
          bgColor="#ffffff"
        />
      </div>
      {label ? (
        <p className="mt-3 max-w-[220px] text-center text-xs text-[var(--color-text-secondary)]">
          {label}
        </p>
      ) : null}
    </div>
  );
}
