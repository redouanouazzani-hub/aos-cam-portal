import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login({ matricule, password });
      if (user.doit_activer) {
        await navigate({ to: "/activation" });
        return;
      }
      const target =
        user.role === "adherent" ? "/espace/dashboard" : "/admin/dashboard";
      await navigate({ to: target });
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
        <div
          aria-hidden
          className="absolute -bottom-24 -start-16 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "oklch(0.85 0.12 150)" }}
        />
        <Link to="/" className="relative flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 font-bold backdrop-blur">
            A
          </div>
          <div>
            <div className="text-sm font-semibold">{t("app.name")}</div>
            <div className="text-xs opacity-80">{t("app.fullName")}</div>
          </div>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight">{t("home.heroTitle")}</h2>
          <p className="mt-3 opacity-90 max-w-md">{t("home.heroLead")}</p>
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
            <h1 className="text-2xl font-bold text-foreground">{t("login.title")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("login.subtitle")}</p>

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
                  required
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  placeholder={t("login.matriculePlaceholder")}
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                {loading ? t("login.submitting") : t("login.submit")}
              </button>
            </form>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">{t("login.hint")}</p>
        </div>
      </div>
    </div>
  );
}
