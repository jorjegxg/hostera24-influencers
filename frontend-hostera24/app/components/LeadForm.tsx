"use client";

import { useState } from "react";
import { submitContactMessage } from "@/lib/api";

type LeadFormProps = {
  /** Formular integrat în cardul de contact (fără chenar separat). */
  embedded?: boolean;
};

export function LeadForm({ embedded = false }: LeadFormProps) {
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

  const inputClass =
    "w-full rounded-lg border border-neutral-300 bg-neutral-50/50 px-3 py-2.5 text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-neutral-400 focus:border-[var(--color-accent)] focus:bg-[var(--color-surface)] focus:ring-2 focus:ring-[var(--color-accent)]/25 disabled:opacity-60";

  if (status === "success") {
    return (
      <div
        className={
          embedded
            ? "rounded-xl border border-emerald-200 bg-emerald-50/80 p-6"
            : "mt-8 w-full max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 sm:p-8"
        }
      >
        <p className="text-lg font-semibold text-[var(--color-text-primary)]">
          Mesaj trimis!
        </p>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          Te contactăm în curând la datele lăsate.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-[var(--color-accent)] underline-offset-2 hover:underline"
        >
          Trimite alt mesaj
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        embedded
          ? "w-full"
          : "mt-8 w-full max-w-2xl rounded-2xl border border-neutral-200 bg-[var(--color-surface)] p-6 shadow-sm sm:p-8"
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-1">
          <span className="font-medium text-[var(--color-text-primary)]">
            Nume
          </span>
          <input
            name="nume"
            type="text"
            autoComplete="name"
            required
            disabled={status === "loading"}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-1">
          <span className="font-medium text-[var(--color-text-primary)]">
            Email
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={status === "loading"}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-[var(--color-text-primary)]">
            Telefon
          </span>
          <input
            name="telefon"
            type="tel"
            autoComplete="tel"
            required
            disabled={status === "loading"}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-[var(--color-text-primary)]">
            Mesaj
          </span>
          <textarea
            name="mesaj"
            rows={5}
            required
            disabled={status === "loading"}
            className={`${inputClass} min-h-[120px] resize-y`}
          />
        </label>
      </div>
      {errorText ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {errorText}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className={`mt-6 rounded-lg bg-[var(--color-accent)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60 ${
          embedded ? "w-full" : "w-full sm:w-auto sm:min-w-[200px] sm:px-8"
        }`}
      >
        {status === "loading" ? "Se trimite…" : "Trimite mesajul"}
      </button>
    </form>
  );
}
