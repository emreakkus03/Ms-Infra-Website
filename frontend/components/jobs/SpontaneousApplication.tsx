import { ArrowRight, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function SpontaneousApplication() {
  const t = await getTranslations("SpontaneousApplication");

  const applicationEmail =
    process.env.NEXT_PUBLIC_JOBS_APPLICATION_EMAIL ?? "sollicitatie@msinfra.be";

  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#1B2227] px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#B81C31]/20 blur-3xl" />

          <div className="absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-[#B81C31]/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-[2px] w-9 bg-[#B81C31]" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
                  {t("eyebrow")}
                </span>
              </div>

              <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {t("title")}
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                {t("description")}
              </p>
            </div>

            <div>
              <a
                href={`mailto:${applicationEmail}`}
                className="group inline-flex items-center justify-center gap-3 rounded-lg bg-[#B81C31] px-6 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-[#971728]"
              >
                <Mail size={18} />

                {t("cta")}

                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}