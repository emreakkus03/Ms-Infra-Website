import Image from "next/image";
import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function WhyUsSection() {
  const t = await getTranslations("WhyUsSection");

  const items = [
    {
      key: "experience",
    },
    {
      key: "fluvius",
    },
    {
      key: "equipment",
    },
    {
      key: "complete",
    },
  ] as const;

  return (
    <section className="bg-slate-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[620px]">
            <Image
              src="/images/why-ms-infra.jpg"
              alt="MS Infra infrastructuurwerken"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-9 bg-[#B81C31]" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
              {t("eyebrow")}
            </span>
          </div>

          <h2 className="max-w-xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            {t("description")}
          </p>

          <div className="mt-9 grid gap-6 sm:grid-cols-2">
            {items.map((item, index) => (
              <div key={item.key} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B81C31] text-white">
                  <Check size={18} strokeWidth={2.5} />
                </div>

                <div>
                  <div className="mb-1 text-xs font-bold tracking-[0.14em] text-[#B81C31]">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    {t(`items.${item.key}.title`)}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {t(`items.${item.key}.description`)}
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