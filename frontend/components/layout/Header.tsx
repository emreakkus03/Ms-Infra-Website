"use client";

import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import type { Activity } from "@/lib/activities/api";

export default function Header({
  activities,
  jobsCount,
}: {
  activities: Activity[];
  jobsCount: number;
}) {
  const t = useTranslations("Header");
  const pathname = usePathname();

  const isHomeActive = pathname === "/";
  const isAboutActive = pathname === "/about";
  const isActivitiesActive = pathname === "/activities";
  const isJobsActive = pathname === "/jobs" || pathname.startsWith("/jobs/");
  const isContactActive = pathname === "/contact";

  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileActivitiesOpen, setMobileActivitiesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white backdrop-blur">
      <div className="border-b border-slate-200 bg-white lg:hidden">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-center gap-4 px-3 text-[11px] font-medium text-slate-700 sm:gap-6 sm:px-6 sm:text-xs">
          <a
            href={`tel:${t("phone").replace(/\s/g, "")}`}
            className="flex min-w-0 items-center gap-1.5 transition-colors hover:text-[#B81C31]"
          >
            <Image
              src="/icons/phone.svg"
              alt=""
              width={14}
              height={14}
              className="shrink-0 [filter:brightness(0)_saturate(100%)_invert(16%)_sepia(73%)_saturate(4025%)_hue-rotate(344deg)_brightness(84%)_contrast(91%)]"
            />

            <span className="truncate">{t("phone")}</span>
          </a>

          <span className="h-4 w-px shrink-0 bg-slate-300" />

          <a
            href={`mailto:${t("email")}`}
            className="flex min-w-0 items-center gap-1.5 transition-colors hover:text-[#B81C31]"
          >
            <Image
              src="/icons/mail.svg"
              alt=""
              width={14}
              height={14}
              className="shrink-0 [filter:brightness(0)_saturate(100%)_invert(16%)_sepia(73%)_saturate(4025%)_hue-rotate(344deg)_brightness(84%)_contrast(91%)]"
            />

            <span className="truncate">{t("email")}</span>
          </a>
        </div>
      </div>

      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-end px-4 sm:px-6 lg:justify-between lg:px-8">
        <Link
          href="/"
          className="absolute left-1/2 flex -translate-x-1/2 shrink-0 items-center lg:static lg:translate-x-0"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/logo/ms-infra.png"
            alt="MS Infra"
            width={190}
            height={64}
            priority
            className="h-auto w-[145px] sm:w-[165px] lg:w-[185px]"
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <nav className="flex items-center gap-7">
            <Link
              href="/about"
              className={`relative py-2 text-sm font-semibold transition-colors lg:text-base ${
                isAboutActive
                  ? "text-[#B81C31]"
                  : "text-slate-700 hover:text-[#B81C31]"
              }`}
            >
              {t("about")}

              <span
                className={`absolute inset-x-0 -bottom-1 mx-auto h-[2px] rounded-full bg-[#B81C31] transition-all duration-300 ${
                  isAboutActive ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              />
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setActivitiesOpen(true)}
              onMouseLeave={() => setActivitiesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setActivitiesOpen((open) => !open)}
                className={`relative flex cursor-pointer items-center gap-1.5 py-2 text-sm font-semibold transition-colors lg:text-base ${
                  isActivitiesActive
                    ? "text-[#B81C31]"
                    : "text-slate-700 hover:text-[#B81C31]"
                }`}
              >
                {t("activities")}

                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={`transition-transform duration-200 ${
                    activitiesOpen ? "rotate-180" : ""
                  }`}
                />

                <span
                  className={`absolute inset-x-0 -bottom-1 mx-auto h-[2px] rounded-full bg-[#B81C31] transition-all duration-300 ${
                    isActivitiesActive ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </button>

              {activitiesOpen && (
                <div className="absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-4">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/10">
                    {activities.length > 0 ? (
                      <div className="flex flex-col">
                        {activities.map((activity) => (
                          <Link
                            key={activity.id}
                            href={{
                              pathname: "/activities",
                              hash: activity.slug,
                            }}
                            onClick={() => setActivitiesOpen(false)}
                            className="group flex items-center justify-between rounded-xl px-4 py-3.5 transition-colors hover:bg-slate-50"
                          >
                            <span className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-[#B81C31]">
                              {activity.title}
                            </span>

                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 transition-colors group-hover:bg-[#B81C31]" />
                          </Link>
                        ))}

                        <div className="mt-1 border-t border-slate-100 pt-1">
                          <Link
                            href="/activities"
                            onClick={() => setActivitiesOpen(false)}
                            className="flex items-center rounded-xl px-4 py-3.5 text-sm font-semibold text-[#B81C31] transition-colors hover:bg-[#B81C31]/5"
                          >
                            {t("allActivities")}
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-slate-50 px-4 py-4">
                        <p className="text-sm leading-6 text-slate-500">
                          {t("activitiesEmpty")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
  href="/jobs"
  className={`relative flex items-center gap-2 py-2 text-sm font-semibold transition-colors lg:text-base ${
    isJobsActive
      ? "text-[#B81C31]"
      : "text-slate-700 hover:text-[#B81C31]"
  }`}
>
  <span>{t("jobs")}</span>

  {jobsCount > 0 && (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#B81C31] px-1.5 text-[10px] font-bold leading-none text-white">
      {jobsCount > 9 ? "9+" : jobsCount}
    </span>
  )}

  <span
    className={`absolute inset-x-0 -bottom-1 mx-auto h-[2px] rounded-full bg-[#B81C31] transition-all duration-300 ${
      isJobsActive
        ? "w-full opacity-100"
        : "w-0 opacity-0"
    }`}
  />
</Link>

            <Link
              href="/contact"
              className={`relative py-2 text-sm font-semibold transition-colors lg:text-base ${
                isContactActive
                  ? "text-[#B81C31]"
                  : "text-slate-700 hover:text-[#B81C31]"
              }`}
            >
              {t("contact")}

              <span
                className={`absolute inset-x-0 -bottom-1 mx-auto h-[2px] rounded-full bg-[#B81C31] transition-all duration-300 ${
                  isContactActive ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              />
            </Link>
          </nav>

          <div className="h-6 w-px bg-slate-200" />

          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-50"
            aria-label="Menu openen"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <nav className="flex flex-col">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`border-b border-slate-100 border-l-[3px] py-4 pl-4 text-base font-semibold transition-colors ${
                  isHomeActive
                    ? "border-l-[#B81C31] bg-[#B81C31]/5 text-[#B81C31]"
                    : "border-l-transparent text-slate-800"
                }`}
              >
                {t("home")}
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className={`border-b border-slate-100 border-l-[3px] py-4 pl-4 text-base font-semibold transition-colors ${
                  isAboutActive
                    ? "border-l-[#B81C31] bg-[#B81C31]/5 text-[#B81C31]"
                    : "border-l-transparent text-slate-800"
                }`}
              >
                {t("about")}
              </Link>

              <div className="border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setMobileActivitiesOpen((open) => !open)}
                  className={`flex w-full items-center justify-between border-l-[3px] py-4 pl-4 text-left text-base font-semibold transition-colors ${
                    isActivitiesActive
                      ? "border-l-[#B81C31] bg-[#B81C31]/5 text-[#B81C31]"
                      : "border-l-transparent text-slate-800"
                  }`}
                >
                  {t("activities")}

                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      mobileActivitiesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileActivitiesOpen && (
                  <div className="pb-4">
                    {activities.length > 0 ? (
                      <div className="flex flex-col rounded-xl bg-slate-50 p-2">
                        {activities.map((activity) => (
                          <Link
                            key={activity.id}
                            href={{
                              pathname: "/activities",
                              hash: activity.slug,
                            }}
                            onClick={() => {
                              setMobileOpen(false);
                              setMobileActivitiesOpen(false);
                            }}
                            className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-white hover:text-[#B81C31]"
                          >
                            {activity.title}
                          </Link>
                        ))}

                        <div className="mt-1 border-t border-slate-200 pt-1">
                          <Link
                            href="/activities"
                            onClick={() => {
                              setMobileOpen(false);
                              setMobileActivitiesOpen(false);
                            }}
                            className="block rounded-lg px-3 py-3 text-sm font-semibold text-[#B81C31] transition-colors hover:bg-white"
                          >
                            {t("allActivities")}
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-slate-50 px-4 py-4">
                        <p className="text-sm leading-6 text-slate-500">
                          {t("activitiesEmpty")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

             <Link
  href="/jobs"
  onClick={() => setMobileOpen(false)}
  className={`flex items-center justify-between border-b border-slate-100 border-l-[3px] py-4 pl-4 pr-3 text-base font-semibold transition-colors ${
    isJobsActive
      ? "border-l-[#B81C31] bg-[#B81C31]/5 text-[#B81C31]"
      : "border-l-transparent text-slate-800"
  }`}
>
  <span>{t("jobs")}</span>

  {jobsCount > 0 && (
    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#B81C31] px-1.5 text-xs font-bold leading-none text-white">
      {jobsCount > 9 ? "9+" : jobsCount}
    </span>
  )}
</Link>

              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className={`border-l-[3px] py-4 pl-4 text-base font-semibold transition-colors ${
                  isContactActive
                    ? "border-l-[#B81C31] bg-[#B81C31]/5 text-[#B81C31]"
                    : "border-l-transparent text-slate-800"
                }`}
              >
                {t("contact")}
              </Link>
            </nav>

            <div className="mt-1 border-t border-slate-100 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  {t("language")}
                </span>

                <LanguageSwitcher />
              </div>

              <div className="mt-7 space-y-4">
                <a
                  href={`mailto:${t("email")}`}
                  className="flex items-center gap-3 text-sm font-medium text-slate-600 transition-colors hover:text-[#B81C31]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#B81C31]">
                    <Image
                      src="/icons/mail.svg"
                      alt=""
                      width={18}
                      height={18}
                    />
                  </span>

                  <span>{t("email")}</span>
                </a>

                <a
                  href={`tel:${t("phone").replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm font-medium text-slate-600 transition-colors hover:text-[#B81C31]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#B81C31]">
                    <Image
                      src="/icons/phone.svg"
                      alt=""
                      width={18}
                      height={18}
                    />
                  </span>

                  <span>{t("phone")}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
