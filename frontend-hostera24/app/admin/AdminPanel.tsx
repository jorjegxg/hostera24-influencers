"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  adminLogin,
  fetchAdminContactMessages,
  type AdminContactMessage,
} from "@/lib/api";
import {
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from "@/lib/admin-auth";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ro-RO", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function AdminPanel() {
  const [token, setToken] = useState<string | null>(null);
  const [parola, setParola] = useState("");
  const [mesaje, setMesaje] = useState<AdminContactMessage[]>([]);
  const [status, setStatus] = useState<
    "init" | "loading" | "ready" | "login" | "error"
  >("init");
  const [errorText, setErrorText] = useState<string | null>(null);

  const loadMesaje = useCallback(async (accessToken: string) => {
    setStatus("loading");
    setErrorText(null);
    try {
      const data = await fetchAdminContactMessages(accessToken);
      setMesaje(data);
      setStatus("ready");
    } catch (err) {
      clearAdminToken();
      setToken(null);
      setStatus("error");
      setErrorText(
        err instanceof Error ? err.message : "Nu am putut încărca mesajele.",
      );
    }
  }, []);

  useEffect(() => {
    const stored = getAdminToken();
    if (stored) {
      setToken(stored);
      void loadMesaje(stored);
    } else {
      setStatus("login");
    }
  }, [loadMesaje]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorText(null);
    try {
      const { accessToken } = await adminLogin(parola);
      setAdminToken(accessToken);
      setToken(accessToken);
      setParola("");
      await loadMesaje(accessToken);
    } catch (err) {
      setStatus("login");
      setErrorText(
        err instanceof Error ? err.message : "Autentificare eșuată.",
      );
    }
  }

  function handleLogout() {
    clearAdminToken();
    setToken(null);
    setMesaje([]);
    setStatus("login");
    setParola("");
  }

  if (status === "init" || (status === "loading" && !token)) {
    return (
      <p className="text-[var(--color-text-secondary)]">Se încarcă…</p>
    );
  }

  if (!token) {
    return (
      <form
        onSubmit={handleLogin}
        className="mx-auto max-w-sm rounded-2xl border border-neutral-200 bg-[var(--color-surface)] p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Autentificare admin
        </h2>
        <label className="mt-4 flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Parolă</span>
          <input
            type="password"
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            autoComplete="current-password"
            required
            disabled={status === "loading"}
            className="w-full rounded-lg border border-neutral-300 bg-neutral-50/50 px-3 py-2.5 outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/25"
          />
        </label>
        {errorText ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {errorText}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 w-full rounded-lg bg-[var(--color-accent)] py-3 text-sm font-semibold text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
        >
          {status === "loading" ? "Se verifică…" : "Intră"}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          {mesaje.length} mesaj{mesaje.length === 1 ? "" : "e"} de contact
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => token && void loadMesaje(token)}
            disabled={status === "loading"}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 disabled:opacity-60"
          >
            Reîncarcă
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Deconectare
          </button>
        </div>
      </div>

      {errorText ? (
        <p className="text-sm text-red-600" role="alert">
          {errorText}
        </p>
      ) : null}

      {status === "loading" ? (
        <p className="text-[var(--color-text-secondary)]">Se încarcă mesajele…</p>
      ) : mesaje.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 bg-[var(--color-surface)] p-8 text-center text-[var(--color-text-secondary)]">
          Niciun mesaj încă.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-[var(--color-surface)] shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-[var(--color-text-secondary)]">
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Nume</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Telefon</th>
                <th className="px-4 py-3 font-medium">Mesaj</th>
              </tr>
            </thead>
            <tbody>
              {mesaje.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-neutral-100 align-top last:border-0"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--color-text-secondary)]">
                    {formatDate(m.creatLa)}
                  </td>
                  <td className="px-4 py-3 font-medium">{m.nume}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${m.email}`}
                      className="text-[var(--color-accent)] hover:underline"
                    >
                      {m.email}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{m.telefon}</td>
                  <td className="max-w-xs px-4 py-3 text-[var(--color-text-secondary)]">
                    <p className="whitespace-pre-wrap break-words">
                      {m.mesaj ?? "—"}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
