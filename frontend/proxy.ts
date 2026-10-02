import type {NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const handleRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = handleRouting(request);
  // next-intl cannot infer translated slugs. The detail page supplies real hreflang URLs.
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  const localizedJobPaths = Object.values(routing.pathnames['/jobs/[slug]']).map(path => path.split('/')[1]);
  const withoutLocale = routing.locales.some(locale => locale === segments[0]) ? segments.slice(1) : segments;
  if (withoutLocale.length === 2 && localizedJobPaths.includes(withoutLocale[0])) {
    response.headers.delete('link');
  }
  return response;
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};