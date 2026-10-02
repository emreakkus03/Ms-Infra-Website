import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';

import {routing} from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from "@/components/layout/Footer";
import FloatingButtons from '@/components/layout/FloatingButtons';
import {getActivities} from '@/lib/activities/api';
import {getJobs} from '@/lib/jobs/api';

import './globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

 const [activities, jobs] = await Promise.all([
  getActivities(locale),
  getJobs(locale),
]);

const jobsCount = jobs.length;

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <Header
  activities={activities}
  jobsCount={jobsCount}
/>
          <FloatingButtons />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}