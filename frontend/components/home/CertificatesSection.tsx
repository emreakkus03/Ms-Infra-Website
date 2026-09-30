import Image from "next/image";
import { getTranslations } from "next-intl/server";

const certificates = [
  {
    name: "Certificate 1",
    image: "/certificates/certificate-1.png",
  },
  {
    name: "Certificate 2",
    image: "/certificates/ISO_9001-2015.svg.png",
  },
  {
    name: "Certificate 3",
    image: "/certificates/nclient-03.png",
  },
  {
    name: "Certificate 4",
    image: "/certificates/Group 31.png",
  },
];

export default async function CertificatesSection() {
  const t = await getTranslations("CertificatesSection");

  return (
    <section className="bg-slate-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-[2px] w-9 bg-[#B81C31]" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
              {t("eyebrow")}
            </span>

            <span className="h-[2px] w-9 bg-[#B81C31]" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            {t("description")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:mt-16 lg:grid-cols-4">
          {certificates.map((certificate) => (
            <div
              key={certificate.name}
              className="group flex min-h-[160px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:min-h-[190px] sm:p-8"
            >
              <div className="relative h-20 w-full sm:h-24">
                <Image
                  src={certificate.image}
                  alt={certificate.name}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 20vw, 45vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}