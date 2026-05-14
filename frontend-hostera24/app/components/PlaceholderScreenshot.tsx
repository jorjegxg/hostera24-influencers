type PlaceholderScreenshotProps = {
  variant?: "default" | "compact";
};

export function PlaceholderScreenshot({
  variant = "default",
}: PlaceholderScreenshotProps) {
  const variantClass =
    variant === "compact"
      ? "max-w-[112px] px-2 text-[10px] leading-tight sm:max-w-[128px] sm:text-xs"
      : "max-w-[280px] px-4 text-sm sm:max-w-[320px]";

  return (
    <div
      className={`flex aspect-[9/16] w-full shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-placeholder-border)] bg-neutral-200 text-center leading-snug text-[var(--color-text-secondary)] ${variantClass}`}
      role="img"
      aria-label="Placeholder screenshot aplicație HOSTERA24"
    >
      Screenshot aplicație HOSTERA24
    </div>
  );
}
