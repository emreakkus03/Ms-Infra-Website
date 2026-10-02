import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Link, getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getJob } from "@/lib/jobs/api";
import { siteUrl } from "@/lib/jobs/config";
import { safeContentUrl } from "@/lib/jobs/content-url";

import JobMetadata from "@/components/jobs/JobMetadata";
import ApplicationCta from "@/components/jobs/ApplicationCta";
import ContentSections from "@/components/content/ContentSections";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

async function requestedJob(params: Props["params"]) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const job = await getJob(locale, slug);

  if (!job) {
    notFound();
  }

  return job;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const job = await requestedJob(params);

  const languages = Object.fromEntries(
    routing.locales.flatMap((locale) => {
      const slug = job.alternate_slugs[locale];

      return slug
        ? [
            [
              locale,
              getPathname({
                locale,
                href: {
                  pathname: "/jobs/[slug]",
                  params: { slug },
                },
              }),
            ],
          ]
        : [];
    }),
  );

  return {
    metadataBase: siteUrl(),

    title: job.seo_title || job.title,

    description:
      job.seo_description ||
      job.short_description ||
      undefined,

    alternates: {
      canonical: getPathname({
        locale: job.locale,
        href: {
          pathname: "/jobs/[slug]",
          params: {
            slug: job.slug,
          },
        },
      }),

      languages,
    },
  };
}

export default async function JobPage({ params }: Props) {
  const job = await requestedJob(params);

  setRequestLocale(job.locale);

  const t = await getTranslations({
    locale: job.locale,
    namespace: "JobsPage",
  });

  const hero = safeContentUrl(job.hero_image);

  return (
    <main className="bg-white">
      <header className="relative overflow-hidden bg-[#1B2227]">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#B81C31]/20 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#B81C31]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <Link
            href="/jobs"
            locale={job.locale}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />

            {t("back")}
          </Link>

          <div className="mt-10 max-w-4xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#B81C31]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
                {t("detailEyebrow")}
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {job.title}
            </h1>

            <div className="mt-6 text-slate-300">
              <JobMetadata job={job} />
            </div>

            {job.short_description && (
              <p className="mt-7 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                {job.short_description}
              </p>
            )}
          </div>

          {hero && (
            <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
              <Image
                src={hero}
                alt={job.title}
                width={1600}
                height={900}
                unoptimized
                className="max-h-[520px] w-full object-cover"
              />
            </div>
          )}
        </div>
      </header>

      <section className="bg-white">
        <ContentSections sections={job.sections} />
      </section>

      <ApplicationCta job={job} />
    </main>
  );
}