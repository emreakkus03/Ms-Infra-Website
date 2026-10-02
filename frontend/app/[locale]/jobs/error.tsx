"use client";
import { useTranslations } from "next-intl";
export default function JobsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("JobsPage");
  return <main className="min-h-[50vh] bg-white px-6 py-20 text-[#1B2227]"><div className="mx-auto max-w-4xl"><h1 className="text-3xl font-bold">{t("errorTitle")}</h1><p className="mt-5 text-slate-600">{t("errorDescription")}</p><button onClick={reset} className="mt-8 rounded-lg bg-[#B81C31] px-6 py-3 font-semibold text-white">{t("retry")}</button></div></main>;
}
