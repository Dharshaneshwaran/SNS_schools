"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/use-auth";
import { apiBaseUrl } from "../../services/api-client";
import { LoadingButton } from "../ui/loading-button";

const demoAccounts = [
  { role: "Superadmin", email: "superadmin@sns-erp.local" },
  { role: "Admin", email: "admin@sns-erp.local" },
  { role: "Leader", email: "leader@sns-erp.local" },
];

export function LoginPanel() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@sns-erp.local");
  const [password, setPassword] = useState(
    process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD ?? "ChangeMe123!",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to sign in right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] shadow-[0_40px_120px_rgba(15,23,42,0.12)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden px-8 py-10 sm:px-12 sm:py-14">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-emerald-200/70 via-transparent to-transparent blur-2xl" />
          <p className="relative text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent-strong)]">
            SNS ERP
          </p>
          <div className="relative mt-8 max-w-xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Attendance, timetable, and substitution control in one place.
            </h1>
            <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
              Phase 1 now includes production-shaped authentication, session
              persistence, and a dashboard shell for superadmins, admins, and
              assigned leaders.
            </p>
          </div>
          <div className="relative mt-10 grid gap-4 sm:grid-cols-2">
            <InfoCard label="API" value={apiBaseUrl} />
            <InfoCard
              label="Access"
              value="JWT session with persisted login and role-aware routing"
            />
          </div>
          <div className="relative mt-10 rounded-[1.75rem] border border-[var(--border)] bg-white/75 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
              Demo Accounts
            </p>
            <div className="mt-4 space-y-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] px-4 py-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
                  onClick={() => setEmail(account.email)}
                  type="button"
                >
                  <span className="text-sm font-semibold text-slate-900">
                    {account.role}
                  </span>
                  <span className="text-sm text-slate-600">{account.email}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--panel-strong)] px-8 py-10 sm:px-12 sm:py-14">
          <div className="mx-auto max-w-md">
            <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Use an admin, leader, or superadmin account to access the web
              dashboard.
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
              <LoadingButton disabled={isSubmitting} isLoading={isSubmitting} type="submit">
                Login
              </LoadingButton>
            </form>
            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">
              Teacher logins are reserved for the mobile app.
            </p>
            <p
              className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                error
                  ? "bg-rose-50 text-rose-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {error || "Session persists locally and refresh support is wired in."}
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
