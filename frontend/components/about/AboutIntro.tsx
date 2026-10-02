import { getTranslations } from "next-intl/server";

export default async function AboutIntro() {
  const t = await getTranslations("AboutIntro");

  const stats = [
    "founded",
    "employees",
    "coverage",
    "fluvius",
  ] as const;

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
  <div>
    <div className="mb-4 flex items-center gap-3">
      <span className="h-[2px] w-9 bg-[#B81C31]" />

      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
        {t("eyebrow")}
      </span>
    </div>

    <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
      {t("title")}
    </h2>
  </div>

  <div className="max-w-2xl space-y-5 lg:pt-10">
    <p className="text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
      {t("paragraph1")}
    </p>

    <p className="text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
      {t("paragraph2")}
    </p>
  </div>
</div>

        <div className="mt-14 grid grid-cols-2 border-y border-slate-200 sm:mt-16 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat}
              className={`py-7 sm:py-8 lg:px-8 ${
                index % 2 === 0 ? "pr-4" : "pl-4"
              } ${
                index < stats.length - 1
                  ? "lg:border-r lg:border-slate-200"
                  : ""
              }`}
            >
              <div className="text-2xl font-bold tracking-tight text-[#B81C31] sm:text-3xl lg:text-4xl">
                {t(`stats.${stat}.value`)}
              </div>

              <div className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
                {t(`stats.${stat}.label`)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}