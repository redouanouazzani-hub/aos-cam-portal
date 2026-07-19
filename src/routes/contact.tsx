import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PublicShell } from "@/components/shells/PublicShell";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Mock: côté Laravel, POST /contact { nom, email, sujet, message }
    await new Promise((r) => setTimeout(r, 600));
    toast.success(t("contact.sent"));
    setForm({ nom: "", email: "", sujet: "", message: "" });
    setSending(false);
  };

  return (
    <PublicShell>
      <div className="public-page-header">
        <div className="mx-auto max-w-5xl px-4 py-10 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("contact.title")}
          </h1>
          <p className="mt-3 text-muted-foreground">{t("contact.subtitle")}</p>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <InfoRow icon={MapPin} label={t("contact.addressLabel")} value={t("contact.address")} />
            <InfoRow icon={Phone} label={t("contact.phoneLabel")} value={t("contact.phone")} ltr />
            <InfoRow icon={Mail} label={t("contact.emailLabel")} value={t("contact.email")} ltr />
            <InfoRow icon={Clock} label={t("contact.hoursLabel")} value={t("contact.hours")} />
          </div>

          <form
            onSubmit={submit}
            className="public-card rounded-lg p-6 space-y-4"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-nom">{t("contact.form.name")}</Label>
                <Input
                  id="c-nom"
                  required
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-email">{t("contact.form.email")}</Label>
                <Input
                  id="c-email"
                  type="email"
                  required
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-sujet">{t("contact.form.subject")}</Label>
              <Input
                id="c-sujet"
                required
                value={form.sujet}
                onChange={(e) => setForm({ ...form, sujet: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-msg">{t("contact.form.message")}</Label>
              <Textarea
                id="c-msg"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={sending}>
                {sending ? t("contact.form.sending") : t("contact.form.submit")}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </PublicShell>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  ltr,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="public-card flex items-start gap-3 rounded-lg p-4">
      <div
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/15 text-primary"
        style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 text-sm text-foreground break-words" dir={ltr ? "ltr" : undefined}>
          {value}
        </div>
      </div>
    </div>
  );
}
