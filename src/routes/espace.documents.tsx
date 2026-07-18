import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, FileText, Search, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { documentsService } from "@/services/documents.service";
import type { DocumentGenere, DocumentType } from "@/services/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/espace/documents")({
  component: DocumentsPage,
});

const TYPES: Array<DocumentType | "tous"> = [
  "tous",
  "recu_pre_reservation",
  "autorisation_precompte",
  "attestation",
  "notification_validation",
];

function DocumentsPage() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<DocumentGenere[] | null>(null);
  const [q, setQ] = useState("");
  const [type, setType] = useState<DocumentType | "tous">("tous");
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    setItems(null);
    documentsService
      .getDocuments({ q, type: type === "tous" ? undefined : type })
      .then((d) => {
        if (alive) setItems(d);
      });
    return () => {
      alive = false;
    };
  }, [q, type]);

  const dateLocale = i18n.language.startsWith("ar") ? "ar-MA" : "fr-FR";
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" });

  const isAr = i18n.language.startsWith("ar");
  const label = (d: DocumentGenere) => (isAr && d.nom_ar ? d.nom_ar : d.nom);

  const onDownload = async (d: DocumentGenere) => {
    setDownloading(d.id);
    try {
      const res = await documentsService.telechargerDocument(d.id);
      toast.success(t("documents.downloadOk", { name: res.nom }));
    } catch {
      toast.error(t("documents.downloadErr"));
    } finally {
      setDownloading(null);
    }
  };

  const empty = useMemo(() => items && items.length === 0, [items]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t("documents.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("documents.subtitle")}</p>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("documents.filters")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="ps-9"
              placeholder={t("documents.searchPh")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((tp) => (
                <SelectItem key={tp} value={tp}>
                  {t(`documents.types.${tp}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {items === null ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : empty ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {t("documents.empty")}
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {items!.map((d) => (
            <li key={d.id}>
              <Card>
                <CardContent className="grid gap-4 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <div
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                    style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)", color: "var(--primary)" }}
                    aria-hidden
                  >
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">{label(d)}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">{t(`documents.types.${d.type}`)}</Badge>
                      <span>{fmtDate(d.date)}</span>
                      <span>·</span>
                      <span>
                        {t("documents.dossierRef")}: <span dir="ltr">{d.dossierRef}</span>
                      </span>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
                      {t("documents.watermark", { date: fmtDate(d.filigraneDate), matricule: d.matricule })}
                    </div>
                  </div>
                  <Button
                    onClick={() => onDownload(d)}
                    disabled={downloading === d.id}
                    className="justify-self-end"
                  >
                    {downloading === d.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    <span className="ms-2">{t("documents.download")}</span>
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
