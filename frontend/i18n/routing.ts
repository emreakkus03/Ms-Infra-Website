import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['nl', 'en'],
  defaultLocale: 'nl',

 pathnames: {
  '/': '/',
    '/about': {
      nl: '/over-ons',
      en: '/about-us'
    },

    "/jobs/[slug]": {
      nl: "/vacatures/[slug]",
      en: "/jobs/[slug]",
    },
    "/jobs": {
      nl: "/vacatures",
      en: "/jobs",
    },
    "/contact": {
  nl: "/contact",
  en: "/contact",
},
"/activities": {
      nl: "/activiteiten",
      en: "/activities",
    },
    "/privacy": {
  nl: "/privacybeleid",
  en: "/privacy-policy",
},
  }
 
});