'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';

export default function FloatingButtons() {
  const t = useTranslations('Floating');
  const header = useTranslations('Header');

  const phone = header('phone');
  const email = header('email');

  return (
    <div className="pointer-events-none fixed right-0 top-1/3 z-40 hidden flex-col items-end gap-2 lg:flex">
      <a
        href={`tel:${phone.replace(/\s/g, '')}`}
        aria-label={t('call')}
        className="group/phone pointer-events-auto flex items-center rounded-l-lg bg-[#B81C31] p-3 text-white shadow-lg transition-colors duration-300 hover:bg-[#941728]"
      >
        <Image
          src="/icons/phone.svg"
          alt=""
          width={22}
          height={22}
          className="shrink-0"
        />

        <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover/phone:ml-3 group-hover/phone:max-w-[320px] group-hover/phone:opacity-100">
          <span className="mr-2 font-normal">
            {t('call')}
          </span>

          <span className="font-bold tracking-wide">
            {phone}
          </span>
        </span>
      </a>

      <a
        href={`mailto:${email}`}
        aria-label={t('mail')}
        className="group/mail pointer-events-auto flex items-center rounded-l-lg bg-[#B81C31] p-3 text-white shadow-lg transition-colors duration-300 hover:bg-[#941728]"
      >
        <Image
          src="/icons/mail.svg"
          alt=""
          width={22}
          height={22}
          className="shrink-0"
        />

        <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover/mail:ml-3 group-hover/mail:max-w-[320px] group-hover/mail:opacity-100">
          <span className="mr-2 font-normal">
            {t('mail')}
          </span>

          <span className="font-bold">
            {email}
          </span>
        </span>
      </a>
    </div>
  );
}