import { getTranslations } from "next-intl/server";
export default async function Loading() {
  const t = await getTranslations("JobsPage");
  return <main className="min-h-[50vh] bg-white px-6 py-20 text-[#1B2227]" aria-busy="true"><div className="mx-auto max-w-6xl"><p role="status">{t("loading")}</p><div className="mt-8 h-40 animate-pulse rounded-2xl bg-slate-100" /></div></main>;
}
