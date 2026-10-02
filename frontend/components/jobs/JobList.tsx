import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getJobs } from "@/lib/jobs/api";
import type { JobLocale } from "@/lib/jobs/types";
import JobMetadata from "./JobMetadata";

export default async function JobList({ locale }: { locale: JobLocale }) {
  const [jobs, t] = await Promise.all([getJobs(locale), getTranslations({ locale, namespace: "JobsPage" })]);
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#1B2227] sm:text-4xl">{t("openPositions")}</h2>
        {jobs.length === 0 ? <p className="mt-6 text-slate-600">{t("empty")}</p> : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {jobs.map(job => (
              <Link key={job.id} locale={locale} href={{ pathname: "/jobs/[slug]", params: { slug: job.slug } }}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 transition hover:border-[#B81C31] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B81C31]">
                <h3 className="text-2xl font-bold text-[#1B2227] group-hover:text-[#B81C31]">{job.title}</h3>
                <div className="mt-4 text-slate-600"><JobMetadata job={job} /></div>
                {job.short_description && <p className="mt-5 line-clamp-3 leading-7 text-slate-600">{job.short_description}</p>}
                <span className="mt-auto flex items-center gap-2 pt-7 font-semibold text-[#B81C31]">{t("viewJob")}<ArrowRight size={18} aria-hidden className="transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
