import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { type ReactNode } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/lib/auth-context";

export function PublicShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const links: Array<{ to: string; key: string }> = [
    { to: "/", key: "nav.home" },
    { to: "/missions", key: "nav.missions" },
    { to: "/actualites", key: "nav.news" },
    { to: "/conventions", key: "nav.conventions" },
    { to: "/faq", key: "nav.faq" },
    { to: "/contact", key: "nav.contact" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-card/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <div
              aria-hidden
              className="grid h-10 w-10 place-items-center rounded-xl text-white font-bold shadow-sm"
              style={{ background: "var(--gradient-hero)" }}
            >
              A
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{t("app.name")}</div>
              <div className="text-xs text-muted-foreground hidden sm:block">
                {t("app.fullName")}
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              to={user ? "/espace/dashboard" : "/login"}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("nav.login")}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60 bg-card/60">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground flex flex-wrap gap-2 justify-between">
          <span>© {new Date().getFullYear()} {t("app.name")}</span>
          <span>{t("footer.rights")}</span>
        </div>
      </footer>
    </div>
  );
}
