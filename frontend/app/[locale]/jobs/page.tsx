import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import JobsHero from "@/components/jobs/JobsHero";
import JobList from "@/components/jobs/JobList";
import WhyWorkAtMsInfra from "@/components/jobs/WhyWorkAtMsInfra";
import SpontaneousApplication from "@/components/jobs/SpontaneousApplication";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { siteUrl } from "@/lib/jobs/config";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "Metadata.Jobs",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function JobsPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <main><JobsHero /><JobList locale={locale} /><WhyWorkAtMsInfra /><SpontaneousApplication /></main>;
}
