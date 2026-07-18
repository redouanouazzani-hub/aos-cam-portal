import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/activation")({
  component: ActivationPage,
});

interface Check {
  key: string;
  ok: boolean;
}

function evaluate(pw: string): Check[] {
  return [
    { key: "len", ok: pw.length >= 8 },
    { key: "upper", ok: /[A-Z]/.test(pw) },
    { key: "lower", ok: /[a-z]/.test(pw) },
    { key: "digit", ok: /\d/.test(pw) },
    { key: "symbol", ok: /[^A-Za-z0-9]/.test(pw) },
  ];
}

function ActivationPage() {
  const { t } = useTranslation();
  const { user, activate, loading } = useAuth();
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    if (!user.doit_activer) {
      void navigate({ to: user.role === "adherent" ? "/espace/dashboard" : "/admin/dashboard" });
    }
  }, [loading, user, navigate]);

  const checks = evaluate(pw);
  const strong = checks.every((c) => c.ok);
  const match = pw.length > 0 && pw === pw2;
  const canSubmit = strong && match && !submitting;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const u = await activate(pw);
      toast.success(t("activation.success"));
      await navigate({ to: u.role === "adherent" ? "/espace/dashboard" : "/admin/dashboard" });
    } catch {
      toast.error(t("activation.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div
        className="relative hidden md:flex flex-col justify-between overflow-hidden p-10 text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <Link to="/" className="relative flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 font-bold backdrop-blur">A</div>
          <div>
            <div className="text-sm font-semibold">{t("app.name")}</div>
            <div className="text-xs opacity-80">{t("app.fullName")}</div>
          </div>
        </Link>
        <div>
          <ShieldCheck className="h-10 w-10 opacity-90" aria-hidden />
          <h2 className="mt-4 text-3xl font-bold leading-tight">{t("activation.hero")}</h2>
          <p className="mt-3 opacity-90 max-w-md">{t("activation.heroLead")}</p>
        </div>
        <div className="relative text-xs opacity-70">© {new Date().getFullYear()} {t("app.name")}</div>
      </div>

      <div className="flex flex-col p-6 md:p-10">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="mt-10 mx-auto w-full max-w-sm">
          <div className="rounded-3xl bg-card p-8" style={{ boxShadow: "var(--shadow-lift)" }}>
            <h1 className="text-2xl font-bold text-foreground">{t("activation.title")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("activation.subtitle", { name: user?.fullName ?? "" })}
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="pw" className="block text-sm font-medium">
                  {t("activation.newPassword")}
                </label>
                <input
                  id="pw"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <ul className="space-y-1 text-xs">
                {checks.map((c) => (
                  <li
                    key={c.key}
                    className={`flex items-center gap-1.5 ${c.ok ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                    {t(`activation.rules.${c.key}`)}
                  </li>
                ))}
              </ul>

              <div>
                <label htmlFor="pw2" className="block text-sm font-medium">
                  {t("activation.confirmPassword")}
                </label>
                <input
                  id="pw2"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                {pw2 && !match && (
                  <p className="mt-1 text-xs text-destructive">{t("activation.mismatch")}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card inline-flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? t("activation.submitting") : t("activation.submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
