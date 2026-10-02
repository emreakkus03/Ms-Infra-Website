import Image from "next/image";

import type { ContentSection } from "@/lib/content";
import { safeContentUrl } from "@/lib/jobs/content-url";

import RichText from "./RichText";

function SectionTitle({
  title,
}: {
  title: string | null;
}) {
  if (!title) {
    return null;
  }

  return (
    <h2 className="mb-6 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-[#1B2227] sm:text-3xl lg:text-4xl">
      {title}
    </h2>
  );
}

function CmsImage({
  url,
  alt = "",
  className = "",
}: {
  url: string | null;
  alt?: string;
  className?: string;
}) {
  const src = safeContentUrl(url);

  if (!src) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={800}
      unoptimized
      className={`w-full rounded-2xl object-cover ${className}`}
    />
  );
}

function Section({
  section,
}: {
  section: ContentSection;
}) {
  switch (section.type) {
    case "title_text":
      return (
        <div>
          <SectionTitle title={section.title} />
          <div className="max-w-4xl">
            <RichText html={section.content} />
          </div>
        </div>
      );

    case "rich_text":
      return (
        <div className="max-w-4xl">
          <RichText html={section.content} />
        </div>
      );

    case "image_text":
      return (
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-16">
          <div
            className={
              section.image_position === "right"
                ? "md:order-2"
                : ""
            }
          >
            <CmsImage
              url={section.image}
              alt={section.title ?? ""}
              className="aspect-[4/3]"
            />
          </div>

          <div>
            <SectionTitle title={section.title} />

            <RichText html={section.content} />
          </div>
        </div>
      );

    case "bullet_list":
      return (
        <div className="max-w-4xl">
          <SectionTitle title={section.title} />

          <RichText html={section.content} />

          {section.items.length > 0 && (
            <ul className="mt-7 space-y-4">
              {section.items.map((item, index) => (
                <li
                  key={index}
                  className="flex gap-4 text-base leading-7 text-slate-700 sm:text-lg"
                >
                  <span className="mt-[11px] h-2 w-2 shrink-0 rounded-full bg-[#B81C31]" />

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      );

    case "gallery":
      return (
        <figure>
          <SectionTitle title={section.title} />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {section.images.map((image, index) => (
              <CmsImage
                key={index}
                url={image.url}
                alt={section.title ?? ""}
                className="aspect-[4/3]"
              />
            ))}
          </div>

          {section.caption && (
            <figcaption className="mt-5 max-w-3xl text-sm leading-6 text-slate-500">
              {section.caption}
            </figcaption>
          )}
        </figure>
      );

    case "cta": {
      const href = safeContentUrl(section.button_url);

      return (
        <div className="relative overflow-hidden rounded-3xl bg-slate-50 p-8 sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#B81C31]/10 blur-3xl" />

          <div className="relative z-10">
            <SectionTitle title={section.title} />

            <div className="max-w-3xl">
              <RichText html={section.content} />
            </div>

            {href && section.button_text && (
              <a
                href={href}
                className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#B81C31] px-6 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-[#971728]"
              >
                {section.button_text}
              </a>
            )}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

export default function ContentSections({
  sections,
}: {
  sections: ContentSection[];
}) {
  if (!sections.length) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 text-slate-700 sm:px-6 sm:py-20 lg:space-y-24 lg:px-8 lg:py-24">
      {sections.map((section) => (
        <section key={section.id}>
          <Section section={section} />
        </section>
      ))}
    </div>
  );
}