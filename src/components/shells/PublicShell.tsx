import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, type ReactNode } from "react";
import { Building2, LockKeyhole, Menu, Phone } from "lucide-react";
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
      <div className="hidden border-b border-white/10 bg-primary-dark text-primary-foreground lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[11px]">
          <span>{t("app.fullName")}</span>
          <span className="inline-flex items-center gap-2">
            <Phone className="h-3 w-3" aria-hidden /> {t("contact.phone")}
          </span>
        </div>
      </div>
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 lg:px-6">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-primary/15 bg-primary text-white shadow-sm"
              aria-hidden
            >
              <Building2 className="h-6 w-6" strokeWidth={1.7} />
            </div>
            <div className="leading-tight min-w-0">
              <div className="text-base font-bold tracking-[0.08em] text-primary truncate">
                {t("app.name")}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground hidden sm:block truncate">
                {t("app.fullName")}
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-primary after:scale-x-100" }}
                className="relative px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors after:absolute after:inset-x-3 after:-bottom-3.5 after:h-0.5 after:origin-center after:scale-x-0 after:bg-accent after:transition-transform hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              className="hidden sm:inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LockKeyhole className="h-4 w-4" aria-hidden />
              {t("nav.login")}
            </Link>

            {/* Mobile hamburger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label={t("menu.open")}
                  className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

      <footer className="border-t-4 border-accent bg-primary-dark text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-9 lg:px-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-base font-bold tracking-[0.08em]">{t("app.name")}</div>
              <p className="mt-1 max-w-xl text-xs text-white/70">{t("app.fullName")}</p>
            </div>
            <div className="text-xs text-white/65">
              © {new Date().getFullYear()} {t("app.name")} · {t("footer.rights")}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
