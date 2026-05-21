"use client";

import { useState } from "react";
import { submitContactMessage } from "@/lib/api";

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorText, setErrorText] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const nume = String(fd.get("nume") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const telefon = String(fd.get("telefon") ?? "").trim();
    const mesaj = String(fd.get("mesaj") ?? "").trim();

    if (!nume || !email || !telefon) {
      setErrorText("Completează numele, emailul și telefonul.");
      setStatus("error");
      return;
    }
    if (!mesaj) {
      setErrorText("Scrie un mesaj.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorText(null);

    try {
      await submitContactMessage({
        tip: "contact",
        nume,
        email,
        telefon,
        mesaj,
      });
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorText(
        err instanceof Error
          ? err.message
          : "Nu am putut trimite mesajul. Încearcă din nou.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto mt-6 w-full max-w-lg rounded-xl border border-emerald-200 bg-emerald-50/80 p-6 text-center">
        <p className="text-lg font-semibold text-[var(--color-text-primary)]">
          Mesaj trimis!
        </p>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Te contactăm în curând la datele lăsate.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-[var(--color-accent)] underline"
        >
          Trimite alt mesaj
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 w-full md:w-[min(100%,50vw)]">
      <form
        id="contact"
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 rounded-xl border border-neutral-200 bg-[var(--color-surface)] p-5 shadow-sm"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-primary)]">
            Nume
          </span>
          <input
            name="nume"
            type="text"
            autoComplete="name"
            required
            disabled={status === "loading"}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-[var(--color-text-primary)] outline-none ring-[var(--color-accent)] focus:ring-2 disabled:opacity-60"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-primary)]">
            Email
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={status === "loading"}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-[var(--color-text-primary)] outline-none ring-[var(--color-accent)] focus:ring-2 disabled:opacity-60"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-primary)]">
            Telefon
          </span>
          <input
            name="telefon"
            type="tel"
            autoComplete="tel"
            required
            disabled={status === "loading"}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-[var(--color-text-primary)] outline-none ring-[var(--color-accent)] focus:ring-2 disabled:opacity-60"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-primary)]">
            Mesaj
          </span>
          <textarea
            name="mesaj"
            rows={4}
            required
            disabled={status === "loading"}
            className="resize-y rounded-lg border border-neutral-300 px-3 py-2 text-[var(--color-text-primary)] outline-none ring-[var(--color-accent)] focus:ring-2 disabled:opacity-60"
          />
        </label>
        {errorText ? (
          <p className="text-sm text-red-600" role="alert">
            {errorText}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-1 rounded-lg bg-[var(--color-accent)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Se trimite…" : "Trimite mesajul"}
        </button>
      </form>
    </div>
  );
}
