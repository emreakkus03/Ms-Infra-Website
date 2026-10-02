import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "Metadata.Privacy",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("PrivacyPage");
  const general = await getTranslations("General");

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[#1B2227] py-20 sm:py-24 lg:py-28">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#B81C31]/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#B81C31]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
                {t("eyebrow")}
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              {t("intro")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-[#1B2227] sm:text-3xl">
                {t("controller.title")}
              </h2>

              <div className="mt-5 space-y-2 leading-7">
                <p>{general("companyName")}</p>
                <p>{general("address")}</p>
                <p>
                  {t("vatLabel")}: {general("vat")}
                </p>

                <p>
                  <a
                    href={`mailto:${general("email")}`}
                    className="font-medium text-[#B81C31] hover:underline"
                  >
                    {general("email")}
                  </a>
                </p>

                <p>
                  <a
                    href={`tel:${general("phoneHref")}`}
                    className="font-medium text-[#B81C31] hover:underline"
                  >
                    {general("phone")}
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1B2227] sm:text-3xl">
                {t("data.title")}
              </h2>

              <p className="mt-5 leading-7">
                {t("data.description")}
              </p>

              <ul className="mt-5 space-y-3">
                {[
                  "name",
                  "email",
                  "phone",
                  "subject",
                  "message",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 leading-7"
                  >
                    <span className="mt-[11px] h-2 w-2 shrink-0 rounded-full bg-[#B81C31]" />
                    <span>{t(`data.items.${item}`)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1B2227] sm:text-3xl">
                {t("purposes.title")}
              </h2>

              <p className="mt-5 leading-7">
                {t("purposes.description")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1B2227] sm:text-3xl">
                {t("legalBasis.title")}
              </h2>

              <p className="mt-5 leading-7">
                {t("legalBasis.description")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1B2227] sm:text-3xl">
                {t("processors.title")}
              </h2>

              <p className="mt-5 leading-7">
                {t("processors.description")}
              </p>

              <p className="mt-4 leading-7">
                {t("processors.brevo")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1B2227] sm:text-3xl">
                {t("retention.title")}
              </h2>

              <p className="mt-5 leading-7">
                {t("retention.description")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1B2227] sm:text-3xl">
                {t("rights.title")}
              </h2>

              <p className="mt-5 leading-7">
                {t("rights.description")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1B2227] sm:text-3xl">
                {t("security.title")}
              </h2>

              <p className="mt-5 leading-7">
                {t("security.description")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1B2227] sm:text-3xl">
                {t("cookies.title")}
              </h2>

              <p className="mt-5 leading-7">
                {t("cookies.description")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1B2227] sm:text-3xl">
                {t("changes.title")}
              </h2>

              <p className="mt-5 leading-7">
                {t("changes.description")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1B2227] sm:text-3xl">
                {t("contact.title")}
              </h2>

              <p className="mt-5 leading-7">
                {t("contact.description")}
              </p>

              <a
                href={`mailto:${general("email")}`}
                className="mt-4 inline-block font-semibold text-[#B81C31] hover:underline"
              >
                {general("email")}
              </a>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}