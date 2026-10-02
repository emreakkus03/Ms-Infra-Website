import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getActivities } from "@/lib/activities/api";


export default async function ActivitiesSection({
  locale,
}: {
  locale: string;
}) {
  const t = await getTranslations("ActivitiesSection");
  const activities = await getActivities(locale);

  const basePath = locale === "nl" ? "/activiteiten" : "/activities";

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#B81C31]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
                {t("eyebrow")}
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              {t("description")}
            </p>
          </div>

         <Link
  href="/activities"
  className="group inline-flex w-fit items-center gap-2 text-base font-semibold text-[#B81C31] transition-colors hover:text-[#941727] lg:mt-12"
>
  {t("allActivities")}

  <ArrowRight
    size={19}
    className="transition-transform duration-200 group-hover:translate-x-1"
  />
</Link>
        </div>

        {activities.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.slice(0, 3).map((activity) => (
              <Link
                key={activity.id}
               href={{
  pathname: "/activities",
  hash: activity.slug,
}}
                className="group relative min-h-[420px] overflow-hidden rounded-2xl bg-slate-900"
              >
                {activity.hero_image && (
                  <img
                    src={activity.hero_image}
                    alt={activity.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-white sm:text-2xl">
                      {activity.title}
                    </h3>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#B81C31] text-white transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight size={19} />
                    </div>
                  </div>

                  <div className="pointer-events-none max-h-0 translate-y-5 overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:max-h-40 group-hover:translate-y-0 group-hover:opacity-100">
                    {activity.description && (
                      <p className="mt-4 line-clamp-2 max-w-[90%] text-sm leading-6 text-white/85 sm:text-base">
                        {activity.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-white">
                      <span>{t("readMore")}</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">{t("empty")}</p>
        )}
      </div>
    </section>
  );
}