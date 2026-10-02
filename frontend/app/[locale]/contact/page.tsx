import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import ContactMap from "@/components/contact/ContactMap";


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
    namespace: "Metadata.Contact",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}


export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactSection />
      <ContactMap />
    </main>
  );
}