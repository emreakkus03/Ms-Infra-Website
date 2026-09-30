import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

import {Link} from '@/i18n/navigation';

export default async function Hero() {
  const t = await getTranslations('HomePage.Hero');

  return (
    <section className="relative min-h-[620px] overflow-hidden sm:min-h-[680px] lg:min-h-[760px]">
<Image
  src="/images/hero-home.jpg"
  alt="MS Infra infrastructuurwerken"
  fill
  priority
  className="object-cover object-[58%_32%] sm:object-[56%_34%] md:object-[54%_center] lg:object-[center_40%]"
  sizes="100vw"
/>

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/15" />

      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-20 sm:min-h-[680px] sm:px-6 lg:min-h-[760px] lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#B81C31]" />

            <span className="text-xs font-bold uppercase tracking-[0.22em] text-white sm:text-sm">
              {t('eyebrow')}
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            {t('title')}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8 lg:text-xl">
            {t('description')}
          </p>

          <div className="mt-8 sm:mt-10">
            <Link
              href="/activiteiten"
              className="group inline-flex items-center gap-3 rounded-lg bg-[#B81C31] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#9f182a] sm:px-7 sm:py-4 sm:text-base"
            >
              {t('cta')}

              <ArrowRight
                size={19}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}