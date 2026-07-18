import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PublicShell } from "@/components/shells/PublicShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});

const KEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"] as const;

function FaqPage() {
  const { t } = useTranslation();
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {t("faq.title")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("faq.subtitle")}</p>

        <Accordion type="single" collapsible className="mt-10">
          {KEYS.map((k) => (
            <AccordionItem key={k} value={k}>
              <AccordionTrigger className="text-start text-base font-medium">
                {t(`faq.${k}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {t(`faq.${k}.a`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </PublicShell>
  );
}
