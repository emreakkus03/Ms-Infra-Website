import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import ContactForm from "@/components/contact/ContactForm";

export default async function ContactSection() {
  const t = await getTranslations("ContactPage.ContactSection");
  const general = await getTranslations("General");

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#B81C31]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
                {t("eyebrow")}
              </span>
            </div>

            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {t("description")}
            </p>

            <div className="mt-10 space-y-6">
              <a
                href={`tel:${general("phoneHref")}`}
                className="group flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#B81C31]/10 text-[#B81C31]">
                  <Phone size={21} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {t("phoneLabel")}
                  </p>

                  <p className="mt-1 font-semibold text-slate-900 transition-colors group-hover:text-[#B81C31]">
                    {general("phone")}
                  </p>
                </div>
              </a>

              <a
                href={`mailto:${general("email")}`}
                className="group flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#B81C31]/10 text-[#B81C31]">
                  <Mail size={21} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {t("emailLabel")}
                  </p>

                  <p className="mt-1 font-semibold text-slate-900 transition-colors group-hover:text-[#B81C31]">
                    {general("email")}
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#B81C31]/10 text-[#B81C31]">
                  <MapPin size={21} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {t("addressLabel")}
                  </p>

                  <p className="mt-1 max-w-xs font-semibold leading-6 text-slate-900">
                    {general("address")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}