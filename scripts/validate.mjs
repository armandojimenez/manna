import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const content = JSON.parse(fs.readFileSync(path.join(root, 'src/content.json'), 'utf8'));
const publication = JSON.parse(fs.readFileSync(path.join(root, 'src/publication.json'), 'utf8'));
const appRoot = process.env.MANNA_APP_ROOT || path.resolve(root, '../../vibe/manna');
const locales = publication.publishedLocales;
const origin = publication.origin.replace(/\/$/, '');
const findings = [];

function fail(scope, message) {
  findings.push(`${scope}: ${message}`);
}

function occurrences(source, fragment) {
  return source.split(fragment).length - 1;
}

function expect(scope, condition, message) {
  if (!condition) fail(scope, message);
}

function routeUrl(locale) {
  return `${origin}/${locale}/`;
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function seoTitle(t) {
  const keywordTitle = t.title.replace(/^Manna\s*:\s*/u, '').trim();
  return `${keywordTitle} | Manna`;
}

function validatePage(locale, file, rootPage = false) {
  const scope = rootPage ? 'root' : locale;
  const html = fs.readFileSync(file, 'utf8');
  const t = content.locales[locale];
  const canonical = routeUrl(locale);
  const legalLocale = publication.legalFallback[locale];
  const legal = publication.legalUrls[legalLocale];
  const apple = `https://apps.apple.com/app/id6760322477?l=${encodeURIComponent(locale === 'es' ? 'es' : locale === 'en' ? 'en' : locale)}`;
  const google = `https://play.google.com/store/apps/details?id=dev.armandojimenez.manna&hl=${encodeURIComponent(t.googleHl)}`;
  const socialImage = `${origin}/assets/og/${locale}.png`;

  expect(scope, html.includes(`<html lang="${locale}"`), 'wrong or missing document language');
  expect(scope, occurrences(html, '<meta name="viewport"') === 1, 'viewport meta must appear exactly once');
  expect(scope, occurrences(html, '<meta name="theme-color"') === 1, 'theme-color meta must appear exactly once');
  expect(scope, occurrences(html, '<link rel="canonical"') === 1, 'canonical link must appear exactly once');
  expect(scope, html.includes(`<link rel="canonical" href="${canonical}">`), 'wrong canonical URL');
  expect(scope, html.includes(rootPage ? 'content="noindex, follow"' : 'content="index, follow, max-image-preview:large"'), 'wrong robots meta');
  expect(scope, occurrences(html, 'rel="alternate" hreflang=') === locales.length + 1, 'hreflang set is incomplete');
  for (const alternate of locales) {
    expect(scope, html.includes(`hreflang="${alternate}" href="${routeUrl(alternate)}"`), `missing ${alternate} hreflang`);
  }
  expect(scope, html.includes(`hreflang="x-default" href="${origin}/"`), 'missing x-default hreflang');
  expect(scope, html.includes('<meta name="apple-itunes-app" content="app-id=6760322477">'), 'missing Safari Smart App Banner');
  expect(scope, html.includes(`<meta property="og:locale" content="${t.ogLocale}">`), 'wrong Open Graph locale');
  expect(scope, occurrences(html, socialImage) === 3, 'Open Graph and Twitter must use the locale-specific social image');
  expect(scope, html.includes('<meta property="og:image:width" content="1200">'), 'wrong Open Graph image width');
  expect(scope, html.includes('<meta property="og:image:height" content="630">'), 'wrong Open Graph image height');
  expect(scope, html.includes('<meta name="twitter:card" content="summary_large_image">'), 'missing Twitter large-image card');
  expect(scope, html.includes('<select id="languageSelect"'), 'missing mobile language selector');
  expect(scope, occurrences(html, '<option value=') === locales.length, 'selector does not match publication allowlist');
  expect(scope, occurrences(html, ' selected>') === 1, 'selector must have exactly one selected locale');
  for (const alternate of locales) {
    const selectorValue = rootPage ? `${alternate}/` : `../${alternate}/`;
    expect(scope, html.includes(`<option value="${selectorValue}" lang="${alternate}"`), `selector option ${alternate} is missing a portable route or language metadata`);
  }
  expect(scope, html.includes(`href="${legal.privacy}"`), `privacy policy does not use ${legalLocale} fallback`);
  expect(scope, html.includes(`href="${legal.terms}"`), `terms do not use ${legalLocale} fallback`);
  expect(scope, html.includes(`href="${legal.privacy}" lang="${locale}" hreflang="${legalLocale}"`), 'privacy link language metadata is incorrect');
  expect(scope, html.includes(`href="${legal.terms}" lang="${locale}" hreflang="${legalLocale}"`), 'terms link language metadata is incorrect');
  expect(scope, !/href="https:\/\/armandojimenez\.dev\/manna\/(?:privacy|terms)\/?"/.test(html), 'obsolete legal URL leaked into page');
  expect(scope, !html.includes('lang-en') && !html.includes('lang-es'), 'legacy toggle-only markup remains');

  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
  expect(scope, occurrences(html, '<title>') === 1, 'document must have exactly one title');
  expect(scope, title === seoTitle(t), 'title must lead with the ASO category term and end with the brand');
  expect(scope, title.length > 20 && title.length <= 60, `title length is ${title.length}, expected 21–60`);
  expect(scope, occurrences(html, '<meta name="description"') === 1, 'document must have exactly one meta description');
  expect(scope, description === t.promo, 'meta description must use the approved localized benefit copy');
  expect(scope, description.length >= 130 && description.length <= 160, `description length is ${description.length}, expected 130–160`);
  expect(scope, occurrences(html, '<h1') === 1 && occurrences(html, '</h1>') === 1, 'document must have exactly one h1');
  expect(scope, occurrences(html, '<h2') >= 3, 'major content sections need h2 headings');
  expect(scope, occurrences(html, '<h3>') === 10, 'original feature and benefit card structure must remain intact');
  expect(scope, html.includes('class="navbar"') && html.includes('class="hero-icon"'), 'original navigation or hero treatment is missing');
  expect(scope, html.includes('class="what-are"') && html.includes('class="stats"') && html.includes('class="showcase"') && html.includes('class="benefits"'), 'original section structure is incomplete');
  expect(scope, !html.includes('manna-mark') && !html.includes('store-button') && !html.includes('site-header'), 'unapproved redesign markup leaked into the page');

  const jsonLdText = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  try {
    const jsonLd = JSON.parse(jsonLdText || '');
    expect(scope, occurrences(html, '<script type="application/ld+json">') === 1, 'document must have exactly one JSON-LD block');
    expect(scope, jsonLd['@type'] === 'MobileApplication', 'structured data must describe a MobileApplication');
    expect(scope, jsonLd.url === canonical, 'structured-data URL does not match canonical');
    expect(scope, jsonLd.description === t.promo, 'structured-data description is not localized benefit copy');
    expect(scope, jsonLd.applicationCategory === 'LifestyleApplication', 'structured data has the wrong application category');
    expect(scope, Array.isArray(jsonLd.operatingSystem) && jsonLd.operatingSystem.includes('iOS') && jsonLd.operatingSystem.includes('Android'), 'structured data needs both operating systems');
    expect(scope, jsonLd.inLanguage === locale, 'structured-data locale mismatch');
    expect(scope, jsonLd.image === `${origin}/assets/app-icon.png`, 'structured-data image must use the absolute app icon URL');
    expect(scope, Array.isArray(jsonLd.screenshot) && jsonLd.screenshot.length === 4, 'structured data needs all four localized screenshots');
    for (const name of ['home', 'categories', 'practice', 'themes']) {
      expect(scope, jsonLd.screenshot?.includes(`${origin}/assets/screenshots/${locale}/${name}.webp`), `structured data is missing the ${name} screenshot`);
    }
    expect(scope, Array.isArray(jsonLd.downloadUrl) && jsonLd.downloadUrl.includes(apple) && jsonLd.downloadUrl.includes(google), 'structured data needs both download URLs');
    expect(scope, !('offers' in jsonLd), 'price offers must remain omitted under the approved MA7 no-price policy');
    expect(scope, Array.isArray(jsonLd.sameAs) && jsonLd.sameAs.length === 2, 'structured data needs both store links');
    expect(scope, !('aggregateRating' in jsonLd) && !('review' in jsonLd), 'ratings or reviews must not be emitted without an attributed source');
  } catch (error) {
    fail(scope, `invalid JSON-LD: ${error.message}`);
  }

  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const ref = match[1].replaceAll('&amp;', '&');
    if (/^(?:https?:|mailto:|tel:)/.test(ref)) continue;
    const target = path.resolve(path.dirname(file), ref.split('?')[0]);
    expect(scope, fs.existsSync(target), `broken local reference ${ref}`);
  }

  const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
  expect(scope, imageTags.every((tag) => /\balt="[^"]*"/.test(tag)), 'every image needs an alt attribute');
  const screenshotTags = imageTags.filter((tag) => tag.includes(`/screenshots/${locale}/`));
  expect(scope, screenshotTags.length === 5, 'page must render the localized hero plus four original showcase screenshots');
  const heroScreenshot = screenshotTags.find((tag) => tag.includes('/home.webp')) || '';
  expect(scope, heroScreenshot.includes(`alt="${t.alts[0]}"`), 'hero screenshot alt text is missing or not localized');
  expect(scope, heroScreenshot.includes('loading="eager"') && heroScreenshot.includes('fetchpriority="high"'), 'hero screenshot must load eagerly at high priority');
  const screenshotNames = ['home', 'categories', 'practice', 'themes'];
  for (const [index, name] of screenshotNames.entries()) {
    const screenshot = screenshotTags.find((tag) => tag.includes(`/${name}.webp`)) || '';
    if (name !== 'home') expect(scope, screenshot.includes('loading="lazy"'), `${name} screenshot must load lazily`);
    expect(scope, screenshot.includes(`alt="${escForHtml(t.alts[index])}"`), `${name} screenshot needs exact localized alt text`);
  }
  expect(scope, !html.includes('<div class="hero-visual" aria-hidden="true">'), 'hero screenshot must not be hidden from accessibility APIs');
  expect(scope, html.includes(`href="${apple}"`) && html.includes(`href="${google}"`), 'crawlable localized store links are incomplete');
  expect(scope, occurrences(html, `href="${apple}" class="store-badge"`) === 2 && occurrences(html, `href="${google}" class="store-badge"`) === 2, 'original store badge links are incomplete');
  expect(scope, occurrences(html, 'app-store-badge.svg') === 2 && occurrences(html, 'google-play-badge.svg') === 2, 'official store badge artwork must remain in both download sections');
  expect(scope, occurrences(html, `alt="${escForHtml(t.appStore)}"`) === 2 && occurrences(html, `alt="${escForHtml(t.playStore)}"`) === 2, 'store badge alt text is not localized');
}

function escForHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const routeDirs = fs.readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, entry.name, 'index.html')))
  .map((entry) => entry.name)
  .sort();
expect('allowlist', JSON.stringify(routeDirs) === JSON.stringify([...locales].sort()), `route directories differ: ${routeDirs.join(', ')}`);
expect('allowlist', JSON.stringify(Object.keys(content.locales).sort()) === JSON.stringify([...locales].sort()), 'content locales differ from publication allowlist');

for (const locale of locales) {
  const file = path.join(root, locale, 'index.html');
  expect(locale, fs.existsSync(file), 'missing locale index');
  if (fs.existsSync(file)) validatePage(locale, file);
}
validatePage(publication.defaultLocale, path.join(root, 'index.html'), true);

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const locale of locales) {
  expect('sitemap', occurrences(sitemap, `<loc>${routeUrl(locale)}</loc>`) === 1, `${locale} route must appear exactly once`);
}
expect('sitemap', occurrences(sitemap, '<loc>') === locales.length, 'sitemap contains a route outside the publication allowlist');
expect('sitemap', !sitemap.includes(`<loc>${origin}/</loc>`), 'x-default root must not be indexed as duplicate English content');

const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
expect('robots', robots.startsWith('User-agent: *\n'), 'robots.txt needs a global user-agent rule');
expect('robots', robots.includes('Allow: /manna/'), 'missing landing allow rule');
expect('robots', robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'missing absolute sitemap directive');
expect('assets', fs.existsSync(path.join(root, '.nojekyll')), 'missing .nojekyll');

const socialHashes = new Set();
for (const locale of locales) {
  const ogPath = path.join(root, 'assets/og', `${locale}.png`);
  expect('social', fs.existsSync(ogPath), `missing ${locale} WhatsApp/Open Graph image`);
  if (fs.existsSync(ogPath)) {
    const dimensions = execFileSync('magick', ['identify', '-format', '%wx%h', ogPath], { encoding: 'utf8' }).trim();
    expect('social', dimensions === '1200x630', `${locale} social image is ${dimensions}, expected 1200x630`);
    expect('social', fs.statSync(ogPath).size < 1_000_000, `${locale} social image exceeds 1 MB`);
    socialHashes.add(sha256(ogPath));
  }
}
expect('social', socialHashes.size === locales.length, 'social cards must be locale-specific rather than shared artwork');

for (const locale of locales) {
  for (const name of ['home', 'categories', 'practice', 'themes']) {
    const file = path.join(root, 'assets/screenshots', locale, `${name}.webp`);
    expect('screenshots', fs.existsSync(file), `missing ${locale}/${name}.webp`);
    if (fs.existsSync(file)) expect('screenshots', fs.statSync(file).size < 250_000, `${locale}/${name}.webp is not web-optimized`);
  }
}

const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
expect('responsive', css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS must respect reduced-motion preferences');

for (const source of content.sources) {
  const file = path.join(appRoot, source.path);
  expect('provenance', fs.existsSync(file), `missing source ${source.path}`);
  if (fs.existsSync(file)) expect('provenance', sha256(file) === source.sha256, `source hash drifted: ${source.path}`);
}
const ma7ApprovalPath = path.join(appRoot, 'docs/expansion/ma7/approval/manifest.json');
expect('provenance', fs.existsSync(ma7ApprovalPath), 'missing MA7 approval manifest');
if (fs.existsSync(ma7ApprovalPath)) {
  const approval = JSON.parse(fs.readFileSync(ma7ApprovalPath, 'utf8'));
  expect('provenance', approval.payloadSha256 === content.approvalPayloadSha256, 'MA7 approval payload hash drifted');
}
const appMa9Path = path.join(appRoot, 'docs/expansion/ma9/publication-manifest.json');
expect('provenance', fs.existsSync(appMa9Path), 'missing authoritative MA9 publication manifest');
if (fs.existsSync(appMa9Path)) {
  const appMa9 = JSON.parse(fs.readFileSync(appMa9Path, 'utf8'));
  expect('provenance', JSON.stringify(appMa9.routeAllowlist) === JSON.stringify(locales), 'landing route allowlist drifted from app MA9 manifest');
  expect('provenance', JSON.stringify(appMa9.legalFallback) === JSON.stringify(publication.legalFallback), 'landing legal fallback drifted from app MA9 manifest');
  expect('provenance', appMa9.externalWriteAuthorized === true, 'MA9 deployment is missing explicit owner authorization');
}
const reviewPath = path.join(root, 'docs/COPY_REVIEW.json');
expect('provenance', fs.existsSync(reviewPath), 'missing exact-content copy review receipt');
if (fs.existsSync(reviewPath)) {
  const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
  expect('provenance', review.status === 'pass', 'copy review receipt is not pass');
  expect('provenance', review.contentSha256 === sha256(path.join(root, 'src/content.json')), 'copy review receipt does not bind current content');
  expect('provenance', review.importToolSha256 === sha256(path.join(root, 'scripts/import-content.mjs')), 'copy review receipt does not bind current authored-string importer');
}

if (findings.length) {
  console.error(`MA9 validation failed with ${findings.length} finding(s):`);
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}
console.log(`MA9 validation passed: ${locales.length} locale routes, 0 findings`);
