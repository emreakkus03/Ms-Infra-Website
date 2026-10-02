import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import {
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { getActivities } from "@/lib/activities/api";
import JobsCta from "@/components/layout/JobsCta";


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
    namespace: "Metadata.Activities",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ActivitiesPage({
  params,
}: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "ActivitiesPage",
  });

  const activities = await getActivities(locale);

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[#1B2227] py-24 sm:py-28 lg:py-32">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#B81C31]/25 blur-3xl" />

        <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#B81C31]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#B81C31]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
                {t("eyebrow")}
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {activities.length > 0 ? (
            <div className="space-y-20 sm:space-y-24 lg:space-y-32">
              {activities.map((activity, index) => {
                const imageRight = index % 2 !== 0;

                return (
                  <section
                    key={activity.id}
                    id={activity.slug}
                    className="scroll-mt-28"
                  >
                    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                      <div
                        className={
                          imageRight
                            ? "lg:order-2"
                            : ""
                        }
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
                          {activity.hero_image ? (
                            <img
                              src={activity.hero_image}
                              alt={activity.title}
                              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-400">
                              MS Infra
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className={
                          imageRight
                            ? "lg:order-1"
                            : ""
                        }
                      >
                        <div className="mb-4 flex items-center gap-3">
                          <span className="text-sm font-bold tracking-[0.18em] text-[#B81C31]">
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>

                          <span className="h-px w-10 bg-[#B81C31]/40" />
                        </div>

                        <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-[#1B2227] sm:text-4xl lg:text-5xl">
                          {activity.title}
                        </h2>

                        {activity.description && (
                          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                            {activity.description}
                          </p>
                        )}

                        {activity.tags.length > 0 && (
                          <ul className="mt-7 flex flex-wrap gap-3">
                            {activity.tags.map((tag, tagIndex) => (
                              <li
                                key={`${tagIndex}-${tag}`}
                                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-[#B81C31]/40 hover:text-[#B81C31]"
                              >
                                {tag}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500">
              {t("empty")}
            </p>
          )}
        </div>
      </section>
      <JobsCta />
    </main>
  );
}