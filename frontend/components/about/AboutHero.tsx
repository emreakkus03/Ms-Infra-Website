import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function AboutHero() {
  const t = await getTranslations("AboutPage.Hero");

  return (
    <section className="relative min-h-[460px] overflow-hidden sm:min-h-[520px] lg:min-h-[750px]">
      <Image
        src="/images/about-hero.jpeg"
        alt="MS Infra"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

      <div className="relative z-10 mx-auto flex min-h-[460px] max-w-7xl items-center px-4 py-16 sm:min-h-[520px] sm:px-6 lg:min-h-[580px] lg:px-8">
  <div className="max-w-3xl translate-y-8 lg:translate-y-12">
    <div className="mb-4 flex items-center gap-3">
      <span className="h-[2px] w-9 bg-[#B81C31]" />

      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white sm:text-sm">
        {t("eyebrow")}
      </span>
    </div>

    <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
      {t("title")}
    </h1>

    <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
      {t("description")}
    </p>
  </div>
</div>
    </section>
  );
}