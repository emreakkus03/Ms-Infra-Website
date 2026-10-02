import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'node:http';
import { createServer as createSocket } from 'node:net';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdtemp, symlink, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

let workspace;

let mode = 'normal';
let next;
let origin;
let output = '';
const slugs = { nl: 'grondwerker', en: 'groundworker' };
function fixture(locale) {
  return {
    id: 1, locale, title: locale === 'nl' ? 'Grondwerker' : 'Groundworker', slug: slugs[locale],
    short_description: locale === 'nl' ? 'Bouw mee aan onze infrastructuur.' : 'Build infrastructure with our team.',
    hero_image: null, employment_type: 'full_time', location: 'Dendermonde', is_featured: false, sort_order: 1,
    alternate_slugs: slugs, seo_title: locale === 'nl' ? 'Vacature Grondwerker | MS Infra' : null,
    seo_description: locale === 'nl' ? 'Solliciteer voor onze vacature.' : null,
    updated_at: '2026-09-30T10:00:00+00:00',
    sections: [
      { id: 1, sort_order: 1, type: 'title_text', title: 'Section one', content: '<p><strong>Bold content</strong> and <em>italic</em> with <u>underline</u>.</p>' },
      { id: 2, sort_order: 2, type: 'image_text', title: 'Section two', content: '<p>Image content</p>', image: '/images/about-hero.jpeg', image_position: 'right' },
      { id: 3, sort_order: 3, type: 'rich_text', content: '<h3>Section three</h3><p><span class="color" data-color="brand" style="--color: #B81C31; --dark-color: #B81C31">Brand text</span></p><ol><li>Ordered item</li></ol>' },
      { id: 4, sort_order: 4, type: 'bullet_list', title: 'Section four', content: null, items: [locale === 'nl' ? 'Nederlands profiel' : 'English profile', 'Second bullet'] },
      { id: 5, sort_order: 5, type: 'gallery', title: 'Section five', caption: 'Gallery caption', images: [{ url: '/images/about-hero.jpeg' }] },
      { id: 6, sort_order: 6, type: 'cta', title: 'Section six', content: '<p>CTA content</p>', button_text: 'CMS action', button_url: '/contact' },
      { id: 7, sort_order: 7, type: 'bullet_list', title: 'Second bullet section', content: null, items: ['Additional requirement'] },
    ],
  };
}
const api = createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const locale = url.searchParams.get('locale') ?? 'nl';
  response.setHeader('Content-Type', 'application/json');
  if (mode === 'error') { response.writeHead(503).end('{"message":"Unavailable"}'); return; }
  if (url.pathname === '/api/jobs') { response.end(JSON.stringify({ data: mode === 'empty' ? [] : [fixture(locale)] })); return; }
  if (url.pathname === `/api/jobs/${slugs[locale]}`) { response.end(JSON.stringify({ data: fixture(locale) })); return; }
  response.writeHead(404).end('{"message":"Not found"}');
});
before(async () => {
  api.listen(0, '127.0.0.1');
  await once(api, 'listening');
  const socket = createSocket().listen(0, '127.0.0.1');
  await once(socket, 'listening');
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  origin = `http://localhost:${port}`;
  workspace = await mkdtemp(join(tmpdir(), 'msinfra-jobs-ssr-'));
  // Isolate Next's cache/lock from any developer server already running.
  for (const entry of ['app', 'components', 'lib', 'i18n', 'messages', 'proxy.ts', 'next.config.ts', 'tsconfig.json', 'package.json', 'postcss.config.mjs']) {
    await cp(join(process.cwd(), entry), join(workspace, entry), { recursive: true });
  }
  await symlink(join(process.cwd(), 'node_modules'), join(workspace, 'node_modules'), 'dir');
  await symlink(join(process.cwd(), 'public'), join(workspace, 'public'), 'dir');
  next = spawn(process.execPath, [join(process.cwd(), 'node_modules/next/dist/bin/next'), 'dev', '--webpack', '--hostname', 'localhost', '--port', String(port)], {
    cwd: workspace,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_API_URL: `http://127.0.0.1:${api.address().port}/api`, NEXT_PUBLIC_SITE_URL: origin, JOBS_APPLICATION_EMAIL: 'applications@example.com' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  next.stdout.on('data', data => { output += data.toString(); });
  next.stderr.on('data', data => { output += data.toString(); });
  for (let attempt = 0; attempt < 90; attempt++) {
    if (next.exitCode !== null) throw new Error(output);
    try { await fetch(`${origin}/favicon.ico`); return; } catch { await new Promise(resolve => setTimeout(resolve, 500)); }
  }
  throw new Error(`Next did not start: ${output}`);
}, { timeout: 60000 });
after(async () => {
  if (next && next.exitCode === null) {
    next.kill('SIGTERM');
    await Promise.race([once(next, 'exit'), new Promise(resolve => setTimeout(resolve, 5000))]);
    if (next.exitCode === null) next.kill('SIGKILL');
  }
  await new Promise(resolve => api.close(resolve));
  if (workspace) await rm(workspace, { recursive: true, force: true });
});
async function page(path) {
  let response;
  try { response = await fetch(origin + path, { headers: { 'User-Agent': 'Googlebot' } }); }
  catch (error) {
    let url = origin + path;
    const chain = [];
    for (let i = 0; i < 4; i++) {
      const check = await fetch(url, { redirect: 'manual' });
      chain.push([url, check.status, Object.fromEntries(check.headers)]);
      if (!check.headers.has('location')) break;
      url = new URL(check.headers.get('location'), url).href;
    }
    throw new Error(`${path}: ${error.cause?.message ?? error.message}\n${JSON.stringify(chain)}\n${output}`);
  }
  return { response, html: await response.text() };
}
test('localized overviews render API cards and correct detail links', { timeout: 60000 }, async () => {
  for (const [path, text, href] of [['/nl/vacatures', 'Openstaande vacatures', '/nl/vacatures/grondwerker'], ['/en/jobs', 'Open positions', '/en/jobs/groundworker']]) {
    const { response, html } = await page(path);
    assert.equal(response.status, 200, output);
    assert.ok(html.includes(text));
    assert.ok(html.includes(`href="${href}"`));
    assert.ok(html.includes('Dendermonde'));
  }
});
test('detail renders every configured section, formatting, metadata and email CTA', { timeout: 60000 }, async () => {
  const { response, html } = await page('/nl/vacatures/grondwerker');
  assert.equal(response.status, 200, output);
  assert.match(html, /<title>Vacature Grondwerker \| MS Infra<\/title>/);
  assert.match(html, /name="description" content="Solliciteer voor onze vacature\."/);
  assert.ok(html.includes(`${origin}/en/jobs/groundworker`));
  assert.ok(!response.headers.get('link')?.includes('/en/jobs/grondwerker'));
  assert.ok(html.includes('<strong>Bold content</strong>'));
  assert.ok(html.includes('<em>italic</em>'));
  assert.ok(html.includes('<u>underline</u>'));
  assert.ok(html.includes('<ol><li>Ordered item</li></ol>'));
  assert.ok(html.includes('data-color="brand"'));
  assert.ok(html.includes('Gallery caption'));
  assert.ok(html.includes('Nederlands profiel'));
  assert.ok(html.includes('mailto:applications@example.com?subject=Sollicitatie%3A%20Grondwerker'));
  let position = -1;
  for (const title of ['Section one', 'Section two', 'Section three', 'Section four', 'Section five', 'Section six', 'Second bullet section']) {
    const nextPosition = html.indexOf(title);
    assert.ok(nextPosition > position, title);
    position = nextPosition;
  }
});
test('English detail uses localized content and SEO fallback', { timeout: 60000 }, async () => {
  const { html } = await page('/en/jobs/groundworker');
  assert.match(html, /<title>Groundworker<\/title>/);
  assert.ok(html.includes('content="Build infrastructure with our team."'));
  assert.ok(html.includes(`${origin}/nl/vacatures/grondwerker`));
  assert.ok(html.includes('English profile'));
  assert.ok(!html.includes('Nederlands profiel'));
  assert.ok(html.includes('Apply by email'));
});
test('wrong localized slug produces not-found and noindex', { timeout: 60000 }, async () => {
  const { response, html } = await page('/en/jobs/grondwerker');
  assert.ok([200, 404].includes(response.status));
  assert.ok(html.includes('Vacancy not found'));
  assert.ok(html.includes('noindex'));
});
test('empty list and API outage are distinct localized states', { timeout: 60000 }, async () => {
  mode = 'empty';
  for (const [path, text] of [['/nl/vacatures', 'Momenteel zijn er geen openstaande vacatures.'], ['/en/jobs', 'There are currently no open positions.']]) {
    assert.ok((await page(path)).html.includes(text));
  }
  mode = 'error';
  const { response, html } = await page('/en/jobs');
  // React streams an error boundary instruction; it must not pretend that the list is empty.
  assert.ok(response.status === 500 || html.includes('NEXT_ERROR') || html.includes('digest'));
  assert.ok(html.includes('Jobs API returned HTTP 503.'));
  assert.doesNotMatch(html, /<p[^>]*>There are currently no open positions\.<\/p>/);
  mode = 'normal';
});
