import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function AboutSection() {
  const t = await getTranslations("AboutSection");

  const stats = [
    {
      key: "founded",
    },
    {
      key: "employees",
    },
    {
      key: "coverage",
    },
  ] as const;

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-9 bg-[#B81C31]" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
              {t("eyebrow")}
            </span>
          </div>

          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>

          <div className="mt-6 max-w-2xl space-y-4">
            <p className="text-base leading-7 text-slate-600 sm:text-lg">
              {t("paragraph1")}
            </p>

            <p className="text-base leading-7 text-slate-600 sm:text-lg">
              {t("paragraph2")}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 border-y border-slate-200 py-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="border-slate-200 sm:border-r sm:last:border-r-0 sm:pr-5"
              >
                <div className="text-2xl font-bold text-[#B81C31] sm:text-3xl">
                  {t(`stats.${stat.key}.value`)}
                </div>

                <div className="mt-1 text-sm font-medium text-slate-600">
                  {t(`stats.${stat.key}.label`)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-base font-semibold text-[#B81C31] transition-colors hover:text-[#941727]"
            >
              {t("cta")}

              <ArrowRight
                size={19}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[620px]">
            <Image
              src="/images/about-ms-infra.jpg"
              alt="MS Infra"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}