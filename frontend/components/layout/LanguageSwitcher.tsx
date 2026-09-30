'use client';

import {useLocale} from 'next-intl';

import {usePathname, useRouter} from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (nextLocale: 'nl' | 'en') => {
    if (nextLocale === locale) return;

    router.replace(pathname, {
      locale: nextLocale
    });
  };

  return (
    <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-1 max-w-[90px] ">
      <button
        type="button"
        onClick={() => changeLocale('nl')}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
          locale === 'nl'
            ? 'bg-[#B81C31] text-white'
            : 'text-gray-600 hover:text-[#B81C31]'
        }`}
      >
        NL
      </button>

      <button
        type="button"
        onClick={() => changeLocale('en')}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
          locale === 'en'
            ? 'bg-[#B81C31] text-white'
            : 'text-gray-600 hover:text-[#B81C31]'
        }`}
      >
        EN
      </button>
    </div>
  );
}