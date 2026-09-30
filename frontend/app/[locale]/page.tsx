import Hero from '@/components/home/Hero';
import ActivitiesSection from "@/components/home/ActivitiesSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import AboutSection from "@/components/home/AboutSection";
import CertificatesSection from "@/components/home/CertificatesSection";
import JobsCta from "@/components/layout/JobsCta";


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