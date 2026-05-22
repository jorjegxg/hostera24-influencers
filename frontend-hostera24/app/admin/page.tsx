import type { Metadata } from "next";
import Link from "next/link";
import { AdminPanel } from "./AdminPanel";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-neutral-200 bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <h1 className="text-lg font-bold text-[var(--color-text-primary)]">
            Admin — mesaje contact
          </h1>
          <Link
            href="/"
            className="text-sm font-medium text-[var(--color-accent)] hover:underline"
          >
            ← Site
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <AdminPanel />
      </main>
    </div>
  );
}
