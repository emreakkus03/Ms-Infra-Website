import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Hero from '@/components/home/Hero';
import ActivitiesSection from "@/components/home/ActivitiesSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import AboutSection from "@/components/home/AboutSection";
import CertificatesSection from "@/components/home/CertificatesSection";
import JobsCta from "@/components/layout/JobsCta";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "Metadata.Home",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main>
      <Hero />
      <ActivitiesSection locale={locale} />
      <WhyUsSection />
      <AboutSection />
      <CertificatesSection />
      <JobsCta />
    </main>
  );
}