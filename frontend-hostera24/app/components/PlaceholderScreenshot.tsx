import Image from "next/image";

const HERO_SCREENSHOT = "/screenshot-exemplu.jpeg";

type PlaceholderScreenshotProps = {
  variant?: "default" | "compact";
};

export function PlaceholderScreenshot({
  variant = "default",
}: PlaceholderScreenshotProps) {
  if (variant === "default") {
    return (
      <Image
        src={HERO_SCREENSHOT}
        alt="Exemplu cod QR Hostera24 — reducere în magazin"
        width={921}
        height={1677}
        priority
        className="w-full max-w-[280px] rounded-2xl border border-neutral-200 bg-white shadow-lg sm:max-w-[320px]"
        sizes="(max-width: 640px) 280px, 320px"
      />
    );
  }

  return (
    <div
      className="flex aspect-[9/16] w-full max-w-[112px] shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-placeholder-border)] bg-neutral-200 px-2 text-center text-[10px] leading-tight text-[var(--color-text-secondary)] sm:max-w-[128px] sm:text-xs"
      role="img"
      aria-label="Placeholder screenshot statistici aplicație"
    >
      Screenshot statistici
    </div>
  );
}
