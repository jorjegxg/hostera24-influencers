import Link from "next/link";

export default function CodNotFound() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center px-5 py-12 text-center">
      <h1 className="text-xl font-bold">Cod QR negăsit</h1>
      <p className="mt-2 text-[var(--color-text-secondary)]">
        Acest link nu este valid sau codul a fost dezactivat.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm text-[var(--color-accent)] hover:underline"
      >
        Înapoi la hostera24
      </Link>
    </main>
  );
}
