import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
import {notFound} from 'next/navigation';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;

  if (!requested || !hasLocale(routing.locales, requested)) {
    notFound();
  }

  return {
    locale: requested,
    messages: (await import(`../messages/${requested}.json`)).default
  };
});