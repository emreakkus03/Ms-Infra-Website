import { BriefcaseBusiness, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { JobSummary } from "@/lib/jobs/types";

export default async function JobMetadata({ job }: { job: JobSummary }) {
  const t = await getTranslations({ locale: job.locale, namespace: "JobsPage" });
  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
      {job.location && <div className="flex items-center gap-2"><MapPin size={17} aria-hidden /><dt className="sr-only">{t("location")}</dt><dd>{job.location}</dd></div>}
      {job.employment_type && <div className="flex items-center gap-2"><BriefcaseBusiness size={17} aria-hidden /><dt className="sr-only">{t("employmentType")}</dt><dd>{t(`employmentTypes.${job.employment_type}`)}</dd></div>}
    </dl>
  );
}
