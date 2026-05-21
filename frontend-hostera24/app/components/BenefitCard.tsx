"use client";

import { BenefitIcon, type BenefitIconName } from "./BenefitIcon";
import { useId, useState, type ReactNode } from "react";

type BenefitCardProps = {
  id: string;
  icon: BenefitIconName;
  title: string;
  body: ReactNode;
};

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      className={`h-5 w-5 shrink-0 text-[var(--color-text-secondary)] transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function BenefitCard({ id, icon, title, body }: BenefitCardProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-[var(--color-surface)] shadow-sm transition-colors ${
        open
          ? "border-[var(--color-accent)]/40"
          : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      <button
        type="button"
        id={`${id}-trigger`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-start gap-4 p-6 text-left transition-colors hover:bg-neutral-50/80 sm:p-8"
      >
        <BenefitIcon name={icon} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
              {title}
            </h3>
            <ChevronDown open={open} />
          </div>
          {!open && (
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Apasă pentru detalii
            </p>
          )}
        </div>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-neutral-100 px-6 pb-6 pt-4 text-[var(--color-text-secondary)] sm:px-8 sm:pb-8 sm:pt-5">
            {body}
          </div>
        </div>
      </div>
    </article>
  );
}
