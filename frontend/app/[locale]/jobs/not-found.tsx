import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
export default async function JobNotFound() {
  const t = await getTranslations("JobsPage");
  return <main className="min-h-[50vh] bg-white px-6 py-20 text-[#1B2227]"><div className="mx-auto max-w-4xl"><h1 className="text-3xl font-bold">{t("notFound")}</h1><p className="mt-5 text-slate-600">{t("notFoundDescription")}</p><Link href="/jobs" className="mt-8 inline-flex rounded-lg bg-[#B81C31] px-6 py-3 font-semibold text-white">{t("back")}</Link></div></main>;
}
