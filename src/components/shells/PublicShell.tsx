import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/lib/auth-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function PublicShell({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const isRtl = i18n.language.startsWith("ar");

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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <div
              aria-hidden
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white font-bold shadow-sm"
              style={{ background: "var(--gradient-hero)" }}
            >
              A
            </div>
            <div className="leading-tight min-w-0">
              <div className="text-sm font-semibold truncate">{t("app.name")}</div>
              <div className="text-xs text-muted-foreground hidden sm:block truncate">
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
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <Link
              to={user ? "/espace/dashboard" : "/login"}
              className="hidden sm:inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("nav.login")}
            </Link>

            {/* Mobile hamburger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label={t("nav.openMenu")}
                  className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Menu className="h-5 w-5" aria-hidden />
                </button>
              </SheetTrigger>
              <SheetContent side={isRtl ? "left" : "right"} className="w-[85%] max-w-sm">
                <SheetHeader>
                  <SheetTitle>{t("app.name")}</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1">
                  {links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      activeOptions={{ exact: l.to === "/" }}
                      activeProps={{ className: "bg-secondary text-foreground" }}
                      className="rounded-xl px-3 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors"
                    >
                      {t(l.key)}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <LanguageSwitcher />
                </div>
                <div className="mt-4">
                  <Link
                    to={user ? "/espace/dashboard" : "/login"}
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-dark transition-colors"
                  >
                    {t("nav.login")}
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
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
