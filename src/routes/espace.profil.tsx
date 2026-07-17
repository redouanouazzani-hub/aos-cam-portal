import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Lock, Info, AlertTriangle, CheckCircle2, Paperclip, Loader2 } from "lucide-react";
import { profileService } from "@/services/profile.service";
import type {
  ProfileResponse,
  Contact,
  ConjointPayload,
} from "@/services/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export const Route = createFileRoute("/espace/profil")({
  component: ProfilePage,
});

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <Lock className="h-3.5 w-3.5" aria-hidden />
        <span>{label}</span>
      </div>
      <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">{value || "—"}</div>
    </div>
  );
}

function ProfilePage() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    profileService.get().then((p) => {
      if (alive) {
        setData(p);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const dateLocale = i18n.language.startsWith("ar") ? "ar-MA" : "fr-FR";
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t("profile.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("profile.subtitle")}</p>
      </header>

      <OfficialSection data={data} fmtDate={fmtDate} />
      <ChildrenSection data={data} fmtDate={fmtDate} />
      <ContactSection
        contact={data.declarative.contact}
        onUpdated={(c) => setData({ ...data, declarative: { ...data.declarative, contact: c } })}
      />
      <ConjointSection
        conjoint={data.declarative.conjoint}
        onCreated={(c) => setData({ ...data, declarative: { ...data.declarative, conjoint: c } })}
      />
    </div>
  );
}

function OfficialSection({
  data,
  fmtDate,
}: {
  data: ProfileResponse;
  fmtDate: (s: string) => string;
}) {
  const { t } = useTranslation();
  const a = data.official.adherent;
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {t("profile.official.title")}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-muted-foreground hover:text-foreground" aria-label="info">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">{t("profile.official.tooltip")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              <Badge variant="secondary" className="gap-1">
                <Lock className="h-3 w-3" /> {t("profile.official.badge")}
              </Badge>
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            <AlertTriangle className="h-4 w-4 me-2" />
            {t("profile.official.reportError")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ReadOnlyField label={t("profile.official.matricule")} value={a.matricule} />
        <ReadOnlyField label={t("profile.official.nom")} value={a.nom} />
        <ReadOnlyField label={t("profile.official.prenom")} value={a.prenom} />
        <ReadOnlyField label={t("profile.official.cin")} value={a.cin} />
        <ReadOnlyField label={t("profile.official.dateNaissance")} value={fmtDate(a.date_naissance)} />
        <ReadOnlyField label={t("profile.official.grade")} value={a.grade} />
        <ReadOnlyField label={t("profile.official.direction")} value={a.direction} />
      </CardContent>
      <DataClaimDialog open={open} onOpenChange={setOpen} />
    </Card>
  );
}

function ChildrenSection({
  data,
  fmtDate,
}: {
  data: ProfileResponse;
  fmtDate: (s: string) => string;
}) {
  const { t } = useTranslation();
  const list = data.official.enfants;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {t("profile.children.title")}
          <Badge variant="secondary" className="gap-1">
            <Lock className="h-3 w-3" /> {t("profile.official.badge")}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("profile.children.empty")}</p>
        ) : (
          <ul className="divide-y rounded-md border">
            {list.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <div className="font-medium">
                    {e.prenom} {e.nom}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t(`profile.children.sexe.${e.sexe}`)} · {fmtDate(e.date_naissance)}
                  </div>
                </div>
                <Lock className="h-4 w-4 text-muted-foreground" aria-hidden />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ContactSection({
  contact,
  onUpdated,
}: {
  contact: Contact;
  onUpdated: (c: Contact) => void;
}) {
  const { t } = useTranslation();
  const [form, setForm] = useState<Contact>(contact);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (patch: Partial<Contact>) => {
    setError(null);
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await profileService.updateContact(form);
      onUpdated(updated);
      toast.success(t("profile.contact.saved"));
    } catch (err) {
      const message = err instanceof Error ? err.message : t("profile.contact.error");
      setError(message);
      toast.error(t("profile.contact.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.contact.title")}</CardTitle>
        <CardDescription>{t("profile.contact.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="tel">{t("profile.contact.telephone")}</Label>
            <Input
              id="tel"
              type="tel"
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              dir="ltr"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">{t("profile.contact.email")}</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              dir="ltr"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="adr">{t("profile.contact.adresse")}</Label>
            <Textarea
              id="adr"
              value={form.adresse}
              onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              rows={2}
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("profile.contact.saving")}
                </>
              ) : (
                t("profile.contact.save")
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ConjointSection({
  conjoint,
  onCreated,
}: {
  conjoint: ProfileResponse["declarative"]["conjoint"];
  onCreated: (c: NonNullable<ProfileResponse["declarative"]["conjoint"]>) => void;
}) {
  const { t } = useTranslation();
  const [form, setForm] = useState<ConjointPayload>({ nom: "", prenom: "", cin: "" });
  const [saving, setSaving] = useState(false);

  if (conjoint) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("profile.conjoint.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-base font-medium">
              {conjoint.prenom} {conjoint.nom}
            </div>
            <Badge
              variant={conjoint.statut === "valide" ? "default" : "secondary"}
              className="gap-1"
            >
              {conjoint.statut === "valide" ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <AlertTriangle className="h-3 w-3" />
              )}
              {t(`profile.conjoint.statut.${conjoint.statut}`)}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {t("profile.conjoint.cin")}: <span dir="ltr">{conjoint.cin}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await profileService.createConjoint(form);
      onCreated(created);
      toast.success(t("profile.conjoint.created"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.conjoint.title")}</CardTitle>
        <CardDescription>{t("profile.conjoint.none")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="cj-nom">{t("profile.conjoint.nom")}</Label>
            <Input
              id="cj-nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cj-prenom">{t("profile.conjoint.prenom")}</Label>
            <Input
              id="cj-prenom"
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cj-cin">{t("profile.conjoint.cin")}</Label>
            <Input
              id="cj-cin"
              value={form.cin}
              onChange={(e) => setForm({ ...form, cin: e.target.value })}
              dir="ltr"
              required
            />
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? t("profile.conjoint.submitting") : t("profile.conjoint.submit")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function DataClaimDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setMessage("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const canSubmit = !!file && !submitting;

  const submit = async () => {
    if (!file) return; // sécurité UI : aucun appel sans fichier
    setSubmitting(true);
    try {
      const res = await profileService.submitDataClaim(message, file);
      toast.success(t("profile.claim.success", { id: res.id }));
      reset();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("profile.claim.title")}</DialogTitle>
          <DialogDescription>{t("profile.claim.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="claim-msg">{t("profile.claim.message")}</Label>
            <Textarea
              id="claim-msg"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("profile.claim.messagePlaceholder")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="claim-file" className="flex items-center gap-1.5">
              <Paperclip className="h-4 w-4" />
              {t("profile.claim.file")} <span className="text-destructive">*</span>
            </Label>
            <Input
              ref={fileRef}
              id="claim-file"
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">{t("profile.claim.fileHint")}</p>
          </div>

          {!file && (
            <Alert variant="default">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{t("profile.claim.fileRequired")}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            {t("profile.claim.cancel")}
          </Button>
          <Button onClick={submit} disabled={!canSubmit}>
            {submitting ? t("profile.claim.submitting") : t("profile.claim.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
