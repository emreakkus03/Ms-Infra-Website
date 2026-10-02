import { getTranslations } from "next-intl/server";

export default async function JobsHero() {
  const t = await getTranslations("JobsPage.Hero");

  return (
    <section className="relative overflow-hidden bg-[#1B2227] py-24 sm:py-28 lg:py-32">
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#B81C31]/25 blur-3xl" />

      <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#B81C31]/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-4xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-9 bg-[#B81C31]" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
              {t("eyebrow")}
            </span>
          </div>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#CBD5E1] sm:text-lg sm:leading-8">
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}