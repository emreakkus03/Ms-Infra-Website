import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutHero from "@/components/about/AboutHero";
import AboutIntro from "@/components/about/AboutIntro";
import AboutRecognitions from "@/components/about/AboutRecognitions";
import AboutApproach from "@/components/about/AboutApproach";
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
    namespace: "Metadata.About",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}


export default function AboutPage() {
  return (
    <main>
      <AboutHero />
        <AboutIntro />
        <AboutRecognitions />
        <AboutApproach />
        <JobsCta />
    </main>
  );
}