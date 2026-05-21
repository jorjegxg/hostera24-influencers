export type BenefitIconName =
  | "cupoane"
  | "postari"
  | "affiliat"
  | "produs-gratis"
  | "primele-x"
  | "statistici-scan"
  | "statistici-ore"
  | "statistici-compar";

type BenefitIconProps = {
  name: BenefitIconName;
  className?: string;
};

const stroke = "currentColor";

function IconPaths({ name }: { name: BenefitIconName }) {
  switch (name) {
    case "cupoane":
      return (
        <>
          <path
            d="M7 7h10v10H7z"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 11h6M9 13h4"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <path
            d="M5 9V5a2 2 0 012-2h4M15 9V5a2 2 0 00-2-2h-4M5 15v4a2 2 0 002 2h4M15 15v4a2 2 0 01-2 2h-4"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      );
    case "postari":
      return (
        <>
          <rect
            x="5"
            y="3"
            width="14"
            height="18"
            rx="2"
            strokeWidth={1.5}
          />
          <path
            d="M8 16h8M8 13h5"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <path
            d="M9 7.5h6M9 10h4"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      );
    case "affiliat":
      return (
        <>
          <circle cx="9" cy="8" r="2.5" strokeWidth={1.5} />
          <circle cx="15" cy="8" r="2.5" strokeWidth={1.5} />
          <path
            d="M5 17c.6-2.2 2-3.5 4-3.5s3.4 1.3 4 3.5M11 17c.6-2.2 2-3.5 4-3.5s3.4 1.3 4 3.5"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <path
            d="M12 8v5M9.5 10.5L12 13l2.5-2.5"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    case "produs-gratis":
      return (
        <>
          <rect
            x="4"
            y="8"
            width="16"
            height="11"
            rx="1.5"
            strokeWidth={1.5}
          />
          <path
            d="M12 8V5.5a2 2 0 012-2h0a2 2 0 012 2V8"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <path
            d="M12 12v3M10.5 13.5L12 12l1.5 1.5"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    case "primele-x":
      return (
        <>
          <path
            d="M12 4v4M12 16v4M4 12h4M16 12h4"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
          <path
            d="M10 12h4"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      );
    case "statistici-scan":
      return (
        <>
          <path
            d="M4 18V6M9 18V10M14 18V8M19 18V4"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      );
    case "statistici-ore":
      return (
        <>
          <circle cx="12" cy="12" r="8" strokeWidth={1.5} />
          <path
            d="M12 8v4l3 2"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    case "statistici-compar":
      return (
        <>
          <path
            d="M6 16V8M12 16V5M18 16v-6"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <path
            d="M4 18h16"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      );
  }
}

export function BenefitIcon({ name, className = "" }: BenefitIconProps) {
  return (
    <span
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        className="h-6 w-6"
        aria-hidden
      >
        <IconPaths name={name} />
      </svg>
    </span>
  );
}
