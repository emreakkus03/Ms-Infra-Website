import { getTranslations } from "next-intl/server";

export default async function ContactMap() {
  const general = await getTranslations("General");

  const address = general("address");

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    address,
  )}&z=15&output=embed`;

  return (
    <section className="w-full">
      <iframe
        src={mapUrl}
        title="MS Infra"
        width="100%"
        height="520"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-[420px] w-full border-0 sm:h-[480px] lg:h-[560px]"
      />
    </section>
  );
}