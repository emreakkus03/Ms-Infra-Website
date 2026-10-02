import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function JobsCta() {
  const t = await getTranslations("JobsCta");

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#1B2227] px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#B81C31]/25 blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#B81C31]/10 blur-3xl" />

          <div className="relative z-10 max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#B81C31]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
                {t("eyebrow")}
              </span>
            </div>

            <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#CBD5E1] sm:text-lg">
              {t("description")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#B81C31] px-6 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-[#971728]"
              >
                {t("primaryCta")}

                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3.5 font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white hover:text-[#1B2227]"
              >
                {t("secondaryCta")}

                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}