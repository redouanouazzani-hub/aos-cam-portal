import { createFileRoute, useNavigate, Link, Navigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Lock } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin-login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { t } = useTranslation();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user && (user.role === "gestionnaire" || user.role === "super-admin")) {
    return <Navigate to="/admin/dashboard" />;
  }
  if (user && user.role === "adherent") {
    return <Navigate to="/espace/dashboard" />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const u = await login({ matricule, password });
      if (u.role !== "gestionnaire" && u.role !== "super-admin") {
        setError(t("adminLogin.notStaff"));
        setLoading(false);
        return;
      }
      await navigate({ to: "/admin/dashboard" });
    } catch {
      setError(t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div
        className="relative hidden md:flex flex-col justify-between overflow-hidden p-10 text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden
          className="absolute -top-24 -end-16 h-80 w-80 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <Link to="/" className="relative flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 font-bold backdrop-blur">
            A
          </div>
          <div>
            <div className="text-sm font-semibold">{t("app.name")}</div>
            <div className="text-xs opacity-80">{t("adminLogin.spaceLabel")}</div>
          </div>
        </Link>
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("adminLogin.staffBadge")}
          </div>
          <h2 className="mt-4 text-3xl font-bold leading-tight">{t("adminLogin.heroTitle")}</h2>
          <p className="mt-3 opacity-90 max-w-md">{t("adminLogin.heroLead")}</p>
        </div>
        <div className="relative text-xs opacity-70">© {new Date().getFullYear()} {t("app.name")}</div>
      </div>

      <div className="flex flex-col p-6 md:p-10">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← {t("common.backHome")}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="mt-10 mx-auto w-full max-w-sm">
          <div
            className="rounded-3xl bg-card p-8"
            style={{ boxShadow: "var(--shadow-lift)" }}
          >
            <div className="flex items-center gap-2 text-primary">
              <Lock className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                {t("adminLogin.staffBadge")}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-foreground">
              {t("adminLogin.title")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("adminLogin.subtitle")}
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="matricule" className="block text-sm font-medium">
                  {t("login.matricule")}
                </label>
                <input
                  id="matricule"
                  type="text"
                  inputMode="numeric"
                  autoComplete="username"
                  dir="ltr"
                  required
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  placeholder={t("adminLogin.matriculePlaceholder")}
                  className="mt-1.5 block w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  {t("login.password")}
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  dir="ltr"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {loading ? t("login.submitting") : t("adminLogin.submit")}
              </button>

              <p className="text-xs text-muted-foreground">
                {t("adminLogin.hint")}
              </p>

              <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                {t("adminLogin.adherentSwitch")}{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  {t("adminLogin.adherentLink")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
