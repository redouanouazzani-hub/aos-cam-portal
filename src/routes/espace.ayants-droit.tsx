import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Lock, AlertTriangle, CheckCircle2, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { profileService } from "@/services/profile.service";
import type { ProfileResponse, ConjointPayload } from "@/services/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/espace/ayants-droit")({
  component: AyantsDroitPage,
});

function AyantsDroitPage() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [claimOpen, setClaimOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    profileService.get().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, []);

  if (!data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const dateLocale = i18n.language.startsWith("ar") ? "ar-MA" : "fr-FR";
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("beneficiaries.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("beneficiaries.subtitle")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setClaimOpen(true)}>
          <AlertTriangle className="h-4 w-4 me-2" />
          {t("profile.official.reportError")}
        </Button>
      </header>

      <ConjointBlock
        conjoint={data.declarative.conjoint}
        onCreated={(c) => setData({ ...data, declarative: { ...data.declarative, conjoint: c } })}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            {t("profile.children.title")}
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3 w-3" /> {t("profile.official.badge")}
            </Badge>
          </CardTitle>
          <CardDescription>{t("beneficiaries.childrenDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {data.official.enfants.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("profile.children.empty")}</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {data.official.enfants.map((e) => (
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

      <DataClaimDialog open={claimOpen} onOpenChange={setClaimOpen} />
    </div>
  );
}

function ConjointBlock({
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
            <Badge variant={conjoint.statut === "valide" ? "default" : "secondary"} className="gap-1">
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
            <Input id="cj-nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
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

function DataClaimDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
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
    if (!file) return;
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
            <Textarea id="claim-msg" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
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
