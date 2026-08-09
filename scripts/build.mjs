import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const template = fs.readFileSync(path.join(root, 'src/page-template.html'), 'utf8');
const content = JSON.parse(fs.readFileSync(path.join(root, 'src/content.json'), 'utf8'));
const publication = JSON.parse(fs.readFileSync(path.join(root, 'src/publication.json'), 'utf8'));
const locales = publication.publishedLocales;
const origin = publication.origin.replace(/\/$/, '');

const ui = {
  'pt-BR': {
    hero: ['Manna.', 'Reúna Sua Verdade Diária.'], practice: 'A Prática', question: 'O que são afirmações cristãs?',
    stats: ['Afirmações', 'Categorias', 'Temas', 'Idiomas'], app: 'O Aplicativo',
    appHeading: 'As promessas de Deus, apresentadas com beleza.', features: 'Recursos',
    featuresHeading: 'Uma prática diária, não apenas outro aplicativo.', custom: 'Afirmações Personalizadas',
    why: 'Por que Manna', benefitsHeading: 'Verdade renovada a cada manhã.<br>Uma prática que transforma.',
    rooted: 'Enraizadas nas Escrituras', renew: 'Renove Sua Mente Diariamente',
    faith: 'Construa uma Fé Inabalável', distractionFree: 'Bonito e Sem Distrações',
    ctaHeading: 'Seu maná diário está esperando.', ctaSub: 'Reúna Sua Verdade Diária.',
    tagline: 'Sem anúncios. Sem ruído. Apenas verdade.',
    verses: [
      ['“Eu fui criado de modo especial e admirável.”', 'Salmos 139:14'],
      ['“Tudo posso naquele que me fortalece.”', 'Filipenses 4:13'],
      ['“Deus não me deu espírito de medo, mas de poder, amor e equilíbrio.”', '2 Timóteo 1:7'],
      ['“Não se amoldem ao padrão deste mundo, mas transformem-se pela renovação da mente.”', 'Romanos 12:2']
    ]
  },
  fr: {
    hero: ['Manna.', 'Recueillez Votre Vérité Quotidienne.'], practice: 'La Pratique', question: 'Que sont les affirmations chrétiennes ?',
    stats: ['Affirmations', 'Catégories', 'Thèmes', 'Langues'], app: 'L’Application',
    appHeading: 'Les promesses de Dieu, magnifiquement présentées.', features: 'Fonctionnalités',
    featuresHeading: 'Une pratique quotidienne, pas une application de plus.', custom: 'Affirmations Personnelles',
    why: 'Pourquoi Manna', benefitsHeading: 'Une vérité renouvelée chaque matin.<br>Une pratique qui transforme.',
    rooted: 'Enracinées dans les Écritures', renew: 'Renouvelez Votre Esprit Chaque Jour',
    faith: 'Bâtissez une Foi Inébranlable', distractionFree: 'Belle et Sans Distractions',
    ctaHeading: 'Votre manne quotidienne vous attend.', ctaSub: 'Recueillez Votre Vérité Quotidienne.',
    tagline: 'Sans publicité. Sans bruit. Seulement la vérité.',
    verses: [
      ['« Je suis une créature merveilleuse. »', 'Psaume 139:14'],
      ['« Je peux tout par celui qui me fortifie. »', 'Philippiens 4:13'],
      ['« Dieu ne nous a pas donné un esprit de peur, mais de force, d’amour et de sagesse. »', '2 Timothée 1:7'],
      ['« Ne vous conformez pas au monde présent, mais soyez transformés par le renouvellement de l’intelligence. »', 'Romains 12:2']
    ]
  },
  de: {
    hero: ['Manna.', 'Sammle Deine Tägliche Wahrheit.'], practice: 'Die Praxis', question: 'Was sind christliche Affirmationen?',
    stats: ['Affirmationen', 'Kategorien', 'Designs', 'Sprachen'], app: 'Die App',
    appHeading: 'Gottes Verheißungen, wunderschön präsentiert.', features: 'Funktionen',
    featuresHeading: 'Eine tägliche Praxis, nicht einfach noch eine App.', custom: 'Eigene Affirmationen',
    why: 'Warum Manna', benefitsHeading: 'Jeden Morgen neue Wahrheit.<br>Eine Praxis, die verändert.',
    rooted: 'In der Bibel Verwurzelt', renew: 'Erneuere Täglich Deinen Geist',
    faith: 'Baue Unerschütterlichen Glauben Auf', distractionFree: 'Schön und Ablenkungsfrei',
    ctaHeading: 'Dein tägliches Manna wartet.', ctaSub: 'Sammle Deine Tägliche Wahrheit.',
    tagline: 'Keine Werbung. Kein Lärm. Nur Wahrheit.',
    verses: [
      ['„Ich bin wunderbar gemacht.“', 'Psalm 139,14'],
      ['„Alles kann ich durch Christus, der mich stärkt.“', 'Philipper 4,13'],
      ['„Gott hat uns nicht einen Geist der Furcht gegeben, sondern der Kraft, der Liebe und der Besonnenheit.“', '2. Timotheus 1,7'],
      ['„Passt euch nicht dieser Welt an, sondern lasst euch durch die Erneuerung eures Sinnes verwandeln.“', 'Römer 12,2']
    ]
  },
  it: {
    hero: ['Manna.', 'Raccogli la Tua Verità Quotidiana.'], practice: 'La Pratica', question: 'Cosa sono le affermazioni cristiane?',
    stats: ['Affermazioni', 'Categorie', 'Temi', 'Lingue'], app: 'L’App',
    appHeading: 'Le promesse di Dio, presentate con bellezza.', features: 'Funzioni',
    featuresHeading: 'Una pratica quotidiana, non un’altra app.', custom: 'Affermazioni Personali',
    why: 'Perché Manna', benefitsHeading: 'Verità nuova ogni mattina.<br>Una pratica che trasforma.',
    rooted: 'Radicate nella Scrittura', renew: 'Rinnova la Tua Mente Ogni Giorno',
    faith: 'Costruisci una Fede Incrollabile', distractionFree: 'Bella e Senza Distrazioni',
    ctaHeading: 'La tua manna quotidiana ti aspetta.', ctaSub: 'Raccogli la Tua Verità Quotidiana.',
    tagline: 'Niente pubblicità. Niente rumore. Solo verità.',
    verses: [
      ['«Sono fatto in modo stupendo.»', 'Salmo 139:14'],
      ['«Tutto posso in colui che mi dà forza.»', 'Filippesi 4:13'],
      ['«Dio non ci ha dato uno spirito di paura, ma di forza, amore e saggezza.»', '2 Timoteo 1:7'],
      ['«Non conformatevi a questo mondo, ma lasciatevi trasformare rinnovando il vostro modo di pensare.»', 'Romani 12:2']
    ]
  },
  pl: {
    hero: ['Manna.', 'Zbieraj Swoją Codzienną Prawdę.'], practice: 'Praktyka', question: 'Czym są afirmacje chrześcijańskie?',
    stats: ['Afirmacje', 'Kategorie', 'Motywy', 'Języki'], app: 'Aplikacja',
    appHeading: 'Boże obietnice, pięknie przedstawione.', features: 'Funkcje',
    featuresHeading: 'Codzienna praktyka, nie kolejna aplikacja.', custom: 'Własne Afirmacje',
    why: 'Dlaczego Manna', benefitsHeading: 'Świeża prawda każdego ranka.<br>Praktyka, która przemienia.',
    rooted: 'Zakorzenione w Piśmie', renew: 'Odnawiaj Umysł Każdego Dnia',
    faith: 'Buduj Niezachwianą Wiarę', distractionFree: 'Piękna i Bez Rozpraszania',
    ctaHeading: 'Twoja codzienna manna czeka.', ctaSub: 'Zbieraj Swoją Codzienną Prawdę.',
    tagline: 'Bez reklam. Bez hałasu. Tylko prawda.',
    verses: [
      ['„Jestem cudownie stworzony.”', 'Psalm 139:14'],
      ['„Wszystko mogę w Tym, który mnie umacnia.”', 'Filipian 4:13'],
      ['„Bóg nie dał nam ducha lęku, lecz mocy, miłości i rozsądku.”', '2 Tymoteusza 1:7'],
      ['„Nie dostosowujcie się do tego świata, lecz przemieniajcie się przez odnawianie umysłu.”', 'Rzymian 12:2']
    ]
  },
  id: {
    hero: ['Manna.', 'Himpun Kebenaran Harianmu.'], practice: 'Latihan', question: 'Apa itu afirmasi Kristen?',
    stats: ['Afirmasi', 'Kategori', 'Tema', 'Bahasa'], app: 'Aplikasi',
    appHeading: 'Janji Tuhan, disajikan dengan indah.', features: 'Fitur',
    featuresHeading: 'Latihan harian, bukan sekadar aplikasi lain.', custom: 'Afirmasi Pribadi',
    why: 'Mengapa Manna', benefitsHeading: 'Kebenaran baru setiap pagi.<br>Latihan yang mengubahkan.',
    rooted: 'Berakar dalam Alkitab', renew: 'Perbarui Pikiranmu Setiap Hari',
    faith: 'Bangun Iman yang Teguh', distractionFree: 'Indah dan Bebas Gangguan',
    ctaHeading: 'Manna harianmu menanti.', ctaSub: 'Himpun Kebenaran Harianmu.',
    tagline: 'Tanpa iklan. Tanpa kebisingan. Hanya kebenaran.',
    verses: [
      ['“Aku diciptakan dengan dahsyat dan ajaib.”', 'Mazmur 139:14'],
      ['“Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.”', 'Filipi 4:13'],
      ['“Allah tidak memberikan kepada kita roh ketakutan, melainkan roh kekuatan, kasih, dan ketertiban.”', '2 Timotius 1:7'],
      ['“Janganlah menjadi serupa dengan dunia ini, tetapi berubahlah oleh pembaruan budimu.”', 'Roma 12:2']
    ]
  }
};

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function localeUrl(locale) {
  return `${origin}/${locale}/`;
}

function seoTitle(t) {
  return `${t.title.replace(/^Manna\s*:\s*/u, '').trim()} | Manna`;
}

function sentence(value, count = 1) {
  return String(value).split(/(?<=[.!?])\s+/u).slice(0, count).join(' ');
}

function localizedValues(locale, t) {
  if (locale === 'en' || locale === 'es') return null;
  const u = ui[locale];
  const safe = (value) => esc(value);
  return [
    safe(t.download),
    safe(t.promo),
    safe(u.practice),
    safe(u.question),
    safe(sentence(t.paragraphs[0], 2)),
    safe(u.verses[0][0]), safe(u.verses[0][1]),
    safe(u.verses[1][0]), safe(u.verses[1][1]),
    safe(u.verses[2][0]), safe(u.verses[2][1]),
    safe(sentence(t.paragraphs[1], 2)),
    safe(u.verses[3][0]), safe(u.verses[3][1]),
    ...u.stats.map(safe),
    safe(u.app),
    safe(u.appHeading),
    safe(sentence(t.paragraphs[3], 1)),
    safe(t.screens[0]),
    safe(t.screens[1]),
    safe(t.screens[2]),
    safe(t.labels.themes),
    safe(u.features),
    safe(u.featuresHeading),
    safe(t.screens[0]),
    safe(sentence(t.paragraphs[2], 1)),
    safe(t.screens[1]),
    safe(sentence(t.paragraphs[1], 1)),
    safe(t.labels.practice),
    safe(sentence(t.paragraphs[4], 1)),
    safe(t.labels.themes),
    safe(sentence(t.paragraphs[5], 1)),
    safe(t.labels.reminders),
    safe(sentence(t.paragraphs[3], 1)),
    safe(u.custom),
    safe(sentence(t.paragraphs[5], 1)),
    safe(u.why),
    `${safe(u.benefitsHeading.split('<br>')[0])}<br>${safe(u.benefitsHeading.split('<br>')[1])}`,
    safe(u.rooted),
    safe(sentence(t.paragraphs[1], 1)),
    safe(u.renew),
    safe(sentence(t.paragraphs[2], 1)),
    safe(u.faith),
    safe(sentence(t.paragraphs[4], 1)),
    safe(u.distractionFree),
    safe(sentence(t.paragraphs[6], 2)),
    safe(u.ctaHeading),
    safe(u.ctaSub),
    safe(t.labels.privacy),
    safe(t.labels.terms),
    `&copy; 2026 Believe PR. ${safe(t.copyright)}`,
    safe(u.tagline)
  ];
}

function head(locale, t, isRoot, asset) {
  const canonical = localeUrl(locale);
  const pageUrl = isRoot ? `${origin}/` : canonical;
  const title = seoTitle(t);
  const apple = `https://apps.apple.com/app/id6760322477?l=${encodeURIComponent(locale)}`;
  const google = `https://play.google.com/store/apps/details?id=dev.armandojimenez.manna&hl=${encodeURIComponent(t.googleHl)}`;
  const hreflang = locales.map((item) => `  <link rel="alternate" hreflang="${item}" href="${localeUrl(item)}">`).join('\n');
  const ogAlternates = locales.filter((item) => item !== locale)
    .map((item) => `  <meta property="og:locale:alternate" content="${content.locales[item].ogLocale}">`).join('\n');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: t.title,
    description: t.promo,
    url: canonical,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: ['iOS', 'Android'],
    inLanguage: locale,
    image: `${origin}/assets/app-icon.png`,
    screenshot: ['home', 'categories', 'practice', 'themes'].map((name) => `${origin}/assets/screenshots/${locale}/${name}.webp`),
    downloadUrl: [apple, google],
    sameAs: [apple, google],
    author: { '@type': 'Person', name: 'Armando Jimenez', url: 'https://armandojimenez.dev/' }
  };
  return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(t.promo)}">
  <meta name="theme-color" content="#FAF8F5">
  <meta name="robots" content="${isRoot ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
  <link rel="canonical" href="${canonical}">
${hreflang}
  <link rel="alternate" hreflang="x-default" href="${origin}/">

  <script>
    try {
      var savedTheme = localStorage.getItem('manna-theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch(e) {}
  </script>

  <meta name="apple-itunes-app" content="app-id=6760322477">

  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(t.promo)}">
  <meta property="og:image" content="${origin}/assets/og/${locale}.png">
  <meta property="og:image:secure_url" content="${origin}/assets/og/${locale}.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(t.alts[0])}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:site_name" content="Manna">
  <meta property="og:locale" content="${t.ogLocale}">
${ogAlternates}

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(t.promo)}">
  <meta name="twitter:image" content="${origin}/assets/og/${locale}.png">
  <meta name="twitter:image:alt" content="${esc(t.alts[0])}">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1" defer></script>

  <script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script>

  <link rel="icon" href="${asset}/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="${asset}/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="${asset}/apple-touch-icon.png">
  <link rel="stylesheet" href="${isRoot ? '' : '../'}style.css">
</head>`;
}

function page(locale, isRoot = false) {
  const t = content.locales[locale];
  const asset = isRoot ? 'assets' : '../assets';
  const legalLocale = publication.legalFallback[locale];
  const legal = publication.legalUrls[legalLocale];
  const apple = `https://apps.apple.com/app/id6760322477?l=${encodeURIComponent(locale)}`;
  const google = `https://play.google.com/store/apps/details?id=dev.armandojimenez.manna&hl=${encodeURIComponent(t.googleHl)}`;
  const options = locales.map((item) =>
    `<option value="${isRoot ? `${item}/` : `../${item}/`}" lang="${item}"${item === locale ? ' selected' : ''}>${esc(content.locales[item].nativeName)}</option>`
  ).join('');

  let html = template;
  if (!isRoot) {
    html = html.replaceAll('assets/', '../assets/');
    html = html.replace('href="style.css"', 'href="../style.css"');
    html = html.replace('src="script.js"', 'src="../script.js"');
  }
  html = html
    .replace(/<html[^>]*>/, `<html lang="${locale}" data-theme="light">`)
    .replace(/<head>[\s\S]*?<\/head>/, head(locale, t, isRoot, asset))
    .replace('aria-label="Main navigation"', `aria-label="${esc(t.labels.language)}"`)
    .replace('<a href="#" class="nav-logo">', `<a href="${localeUrl(locale)}" class="nav-logo">`)
    .replace(
      /<button class="lang-toggle" id="langToggle"[\s\S]*?<\/button>/,
      `<label class="lang-toggle"><span class="sr-only">${esc(t.labels.language)}</span><select id="languageSelect" aria-label="${esc(t.labels.language)}">${options}</select></label>`
    )
    .replace('aria-label="Toggle theme"', `aria-label="${esc(t.theme)}"`)
    .replaceAll('href="https://apps.apple.com/us/app/manna/id6760322477"', `href="${apple}"`)
    .replaceAll('href="https://play.google.com/store/apps/details?id=dev.armandojimenez.manna"', `href="${google}"`)
    .replaceAll('href="https://armandojimenez.dev/manna/privacy"', `href="${legal.privacy}" lang="${locale}" hreflang="${legalLocale}"`)
    .replaceAll('href="https://armandojimenez.dev/manna/terms"', `href="${legal.terms}" lang="${locale}" hreflang="${legalLocale}"`);

  const hero = locale === 'en'
    ? ['Manna.', 'Gather Your<br>Daily Truth.']
    : locale === 'es'
      ? ['Manna.', 'Recoge Tu<br>Verdad Diaria.']
      : [ui[locale].hero[0], ui[locale].hero[1]];
  html = html.replace(
    /<h1 class="hero-title anim-up">[\s\S]*?<\/h1>/,
    `<h1 class="hero-title anim-up">Manna<span class="dot">.</span><br><span class="hero-title-light">${locale === 'en' ? 'Gather Your<br>Daily Truth' : locale === 'es' ? 'Recoge Tu<br>Verdad Diaria' : esc(hero[1].replace(/\.$/, '')).replace(' ', ' ')}<span class="dot">.</span></span></h1>`
  );

  const values = localizedValues(locale, t);
  let pairIndex = 0;
  html = html.replace(
    /<span class="lang-en">([\s\S]*?)<\/span>\s*<span class="lang-es">([\s\S]*?)<\/span>/g,
    (_match, en, es) => {
      if (locale === 'en') return en;
      if (locale === 'es') return es;
      const value = values[pairIndex++];
      if (value == null) throw new Error(`Missing localized body string ${pairIndex - 1} for ${locale}`);
      return value;
    }
  );
  if (values && pairIndex !== values.length) {
    throw new Error(`Localized body string count mismatch for ${locale}: used ${pairIndex}, have ${values.length}`);
  }

  html = html.replace(
    /<img src="[^"]+\/hero-home\.png"[^>]*class="hero-phone-img lang-en">\s*<img src="[^"]+\/hero-home\.png"[^>]*class="hero-phone-img lang-es">/,
    `<img src="${asset}/screenshots/${locale}/home.webp" alt="${esc(t.alts[0])}" class="hero-phone-img" width="720" height="1537" loading="eager" fetchpriority="high">`
  );
  const showcase = [
    ['home-cards', 'home', 0],
    ['categories', 'categories', 1],
    ['practice', 'practice', 2],
    ['themes', 'themes', 3]
  ];
  for (const [oldName, newName, altIndex] of showcase) {
    const pair = new RegExp(
      `<img src="[^"]+/${oldName}\\.png"[^>]*class="showcase-img lang-en"[^>]*>\\s*<img src="[^"]+/${oldName}\\.png"[^>]*class="showcase-img lang-es"[^>]*>`
    );
    html = html.replace(
      pair,
      `<img src="${asset}/screenshots/${locale}/${newName}.webp" alt="${esc(t.alts[altIndex])}" class="showcase-img" loading="lazy" width="720" height="1537">`
    );
  }

  html = html
    .replaceAll(`src="${asset}/app-icon.png"`, `src="${asset}/app-icon.png?v=20260809"`)
    .replaceAll('alt="Download on the App Store"', `alt="${esc(t.appStore)}"`)
    .replaceAll('alt="Get it on Google Play"', `alt="${esc(t.playStore)}"`)
    .replace('</nav>\n      <p class="footer-copy">', `</nav>\n      <p class="footer-copy">`);

  return html;
}

const routeDirs = fs.readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, entry.name, 'index.html')))
  .map((entry) => entry.name);
for (const dir of routeDirs) {
  if (!locales.includes(dir)) throw new Error(`Refusing to leave unpublished locale route: ${dir}`);
}

for (const locale of locales) {
  const dir = path.join(root, locale);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(locale));
}
fs.writeFileSync(path.join(root, 'index.html'), page(publication.defaultLocale, true));

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${locales.map((locale) => `  <url>
    <loc>${localeUrl(locale)}</loc>
    <lastmod>${today}</lastmod>
${locales.map((alternate) => `    <xhtml:link rel="alternate" hreflang="${alternate}" href="${localeUrl(alternate)}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/"/>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *
Allow: /manna/

Sitemap: ${origin}/sitemap.xml
`);
fs.writeFileSync(path.join(root, '.nojekyll'), '');
console.log(`Built the original Manna design for ${locales.length} MA9 locale routes plus x-default root`);
