"use client";

import { FormEvent, useState } from "react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
const demoEmail =
  process.env.NEXT_PUBLIC_DEMO_USER_EMAIL ?? "admin@sns-erp.local";
const demoPassword =
  process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD ?? "ChangeMe123!";

type LoginResult = {
  accessToken: string;
  expiresIn: number;
  user: {
    email: string;
    name: string;
  };
};

export default function Home() {
  const [email, setEmail] = useState(demoEmail);
  const [password, setPassword] = useState(demoPassword);
  const [message, setMessage] = useState(
    "Use the demo credentials to test the connection.",
  );
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setIsError(false);
    setMessage("Signing in...");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as Partial<LoginResult> & {
        message?: string;
      };

      if (!response.ok || !data.user) {
        throw new Error(data.message ?? "Login failed.");
      }

      setMessage(`Welcome back, ${data.user.name}. Token: ${data.accessToken}`);
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error ? error.message : "Unable to reach the backend.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] shadow-[0_40px_120px_rgba(15,23,42,0.12)] backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden px-8 py-10 sm:px-12 sm:py-14">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-emerald-200/70 via-transparent to-transparent blur-2xl" />
          <p className="relative text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent-strong)]">
            SNS ERP
          </p>
          <div className="relative mt-8 max-w-xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              One login surface for web, API, and Flutter.
            </h1>
            <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
              This screen is connected to the Nest backend login endpoint and
              uses env-based URLs so you can swap in Prisma and Supabase later
              without rebuilding the UI contract.
            </p>
          </div>
          <div className="relative mt-10 grid gap-4 sm:grid-cols-2">
            <InfoCard label="API base URL" value={apiBaseUrl} />
            <InfoCard label="Demo email" value={demoEmail} />
          </div>
        </section>

        <section className="bg-[var(--panel-strong)] px-8 py-10 sm:px-12 sm:py-14">
          <div className="mx-auto max-w-md">
            <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              The same login request shape is now used by the web and Flutter
              clients.
            </p>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-emerald-100"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </span>
                <input
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-emerald-100"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>
              <button
                className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>
            <p
              className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                isError
                  ? "bg-rose-50 text-rose-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {message}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white/70 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
        {label}
      </p>
      <p className="mt-3 break-all text-sm text-slate-700">{value}</p>
    </div>
  );
}
