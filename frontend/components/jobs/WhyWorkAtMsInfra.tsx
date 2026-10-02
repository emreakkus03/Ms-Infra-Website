import { getTranslations } from "next-intl/server";

export default async function WhyWorkAtMsInfra() {
  const t = await getTranslations("WhyWorkAtMsInfra");

  const items = [
    "team",
    "projects",
    "equipment",
    "growth",
  ] as const;

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#B81C31]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
                {t("eyebrow")}
              </span>
            </div>

            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {t("description")}
            </p>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {items.map((item, index) => (
              <div
                key={item}
                className="group grid gap-4 py-7 sm:grid-cols-[72px_1fr] sm:gap-6 sm:py-8"
              >
                <div className="text-sm font-bold tracking-[0.18em] text-[#B81C31]">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 transition-colors duration-200 group-hover:text-[#B81C31] sm:text-2xl">
                    {t(`items.${item}.title`)}
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                    {t(`items.${item}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}