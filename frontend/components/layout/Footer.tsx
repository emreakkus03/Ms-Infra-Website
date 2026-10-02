import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const general = await getTranslations("General");

  const currentYear = new Date().getFullYear();

  const navigation = [
    {
      label: t("home"),
      href: "/",
    },
    {
      label: t("about"),
      href: "/about",
    },
    {
      label: t("activities"),
      href: "/activities",
    },
    {
      label: t("jobs"),
      href: "/jobs",
    },
    {
      label: t("contactPage"),
      href: "/contact",
    },
  ] as const;

  const openingHours = [
    {
      day: t("monday"),
      hours: t("weekdayHours"),
    },
    {
      day: t("tuesday"),
      hours: t("weekdayHours"),
    },
    {
      day: t("wednesday"),
      hours: t("weekdayHours"),
    },
    {
      day: t("thursday"),
      hours: t("weekdayHours"),
    },
    {
      day: t("friday"),
      hours: t("weekdayHours"),
    },
    {
      day: t("saturday"),
      hours: t("closed"),
    },
    {
      day: t("sunday"),
      hours: t("closed"),
    },
  ];

  return (
    <footer className="bg-[#1B2227] text-slate-300">
      <div className="h-1 w-full bg-[#B81C31]" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_1.05fr_1fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-flex">
              <Image
                src="/logo/ms-infra.png"
                alt="MS Infra"
                width={210}
                height={70}
                className="h-auto w-[200px]"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400 sm:text-base">
              {t("description")}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={general("facebook")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 transition-all duration-200 hover:border-[#B81C31] hover:bg-[#B81C31]"
              >
                <Image
                  src="/icons/facebook.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] brightness-0 invert"
                />
              </a>

              <a
                href={general("instagram")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 transition-all duration-200 hover:border-[#B81C31] hover:bg-[#B81C31]"
              >
                <Image
                  src="/icons/instagram.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] brightness-0 invert"
                />
              </a>

              <a
                href={general("linkedin")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 transition-all duration-200 hover:border-[#B81C31] hover:bg-[#B81C31]"
              >
                <Image
                  src="/icons/linkedin.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] brightness-0 invert"
                />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
              {t("navigation")}
            </h3>

            <nav className="mt-6 flex flex-col gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-fit text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-[#B81C31]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
              {t("contact")}
            </h3>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[#B81C31]"
                />

                <span className="text-sm leading-6 text-slate-400">
                  {general("address")}
                </span>
              </div>

              <a
                href={`tel:${general("phoneHref")}`}
                className="group flex w-fit items-center gap-3"
              >
                <Phone
                  size={18}
                  className="shrink-0 text-[#B81C31]"
                />

                <span className="text-sm text-slate-400 transition-colors duration-200 group-hover:text-[#B81C31]">
                  {general("phone")}
                </span>
              </a>

              <a
                href={`mailto:${general("email")}`}
                className="group flex w-fit items-center gap-3"
              >
                <Mail
                  size={18}
                  className="shrink-0 text-[#B81C31]"
                />

                <span className="text-sm text-slate-400 transition-colors duration-200 group-hover:text-[#B81C31]">
                  {general("email")}
                </span>
              </a>

              <div className="border-t border-white/10 pt-5">
                <p className="text-sm text-slate-400">
                  <span className="font-semibold text-white">
                    {t("vatLabel")}:
                  </span>{" "}
                  {general("vat")}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
              {t("openingHours")}
            </h3>

            <div className="mt-6 space-y-3">
              {openingHours.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between gap-6 text-sm"
                >
                  <span className="text-slate-400">
                    {item.day}
                  </span>

                  <span
                    className={
                      item.hours === t("closed")
                        ? "font-medium text-[#B81C31]"
                        : "font-medium text-slate-300"
                    }
                  >
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {currentYear} {general("companyName")}. {t("copyright")}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy"
              className="transition-colors duration-200 hover:text-[#B81C31]"
            >
              {t("privacy")}
            </Link>

            <span className="hidden h-3 w-px bg-white/15 sm:block" />

            <span>
              {t("builtByLabel")}{" "}
              <a
                href={general("developerUrl")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition-colors duration-200 hover:text-[#B81C31]"
              >
                Emre Akkus
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}