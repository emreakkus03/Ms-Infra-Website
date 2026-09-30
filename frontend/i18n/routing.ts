import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['nl', 'en'],
  defaultLocale: 'nl',

 pathnames: {
  '/': '/',
    '/about': {
      nl: '/over-ons',
      en: '/about-us'
    }
  }
 
});