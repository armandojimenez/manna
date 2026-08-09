import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, '..');
const appRoot = process.env.MANNA_APP_ROOT || path.resolve(siteRoot, '../../vibe/manna');

const specs = {
  en: { google: 'google-us-en-us', apple: 'apple-us-en', arb: 'app_en.arb' },
  es: { google: 'google-es-es-es', apple: 'apple-es-es', arb: 'app_es.arb' },
  'pt-BR': { google: 'google-br-pt-br', apple: 'apple-br-pt', arb: 'app_pt_BR.arb' },
  fr: { google: 'google-fr-fr-fr', apple: 'apple-fr-fr', arb: 'app_fr.arb' },
  de: { google: 'google-de-de-de', apple: 'apple-de-de', arb: 'app_de.arb' },
  it: { google: 'google-it-it-it', apple: 'apple-it-it', arb: 'app_it.arb' },
  pl: { google: 'google-pl-pl-pl', apple: 'apple-pl-pl', arb: 'app_pl.arb' },
  id: { google: 'google-id-id', apple: 'apple-id-id', arb: 'app_id.arb' }
};

const authored = {
  en: {
    nativeName: 'English', ogLocale: 'en_US', country: 'us', googleHl: 'en', googleGl: 'US',
    headline: ['Bible affirmations.', "Rooted in God’s Word."],
    download: 'Download Manna', appStore: 'Download on the App Store', playStore: 'Get it on Google Play',
    explore: 'See how Manna works', features: 'A quiet rhythm for every day',
    screens: ['Daily Bible affirmations', 'Faith for every season', 'Practice without rushing'],
    alts: ['Manna home screen with a Bible-based affirmation', 'Manna category screen with faith-centered topics', 'Manna guided practice screen', 'Manna theme screen with light and dark color choices'],
    legalNote: 'Privacy and terms are available in English.', theme: 'Change color theme',
    languageLinks: 'Manna in other languages', copyright: 'All rights reserved.'
  },
  es: {
    nativeName: 'Español', ogLocale: 'es_ES', country: 'es', googleHl: 'es', googleGl: 'ES',
    headline: ['Afirmaciones bíblicas.', 'Arraigadas en Su Palabra.'],
    download: 'Descarga Manna', appStore: 'Descargar en el App Store', playStore: 'Disponible en Google Play',
    explore: 'Descubre cómo funciona Manna', features: 'Un ritmo sereno para cada día',
    screens: ['Afirmaciones bíblicas diarias', 'Fe para cada etapa', 'Practica sin prisa'],
    alts: ['Pantalla principal de Manna con una afirmación bíblica', 'Pantalla de categorías de Manna con temas de fe', 'Pantalla de práctica guiada de Manna', 'Pantalla de temas de Manna con opciones de color claras y oscuras'],
    legalNote: 'La privacidad y los términos están disponibles en español.', theme: 'Cambiar tema de color',
    languageLinks: 'Manna en otros idiomas', copyright: 'Todos los derechos reservados.'
  },
  'pt-BR': {
    nativeName: 'Português (Brasil)', selectorName: 'Português', ogLocale: 'pt_BR', country: 'br', googleHl: 'pt_BR', googleGl: 'BR',
    headline: ['Afirmações bíblicas.', 'Enraizadas na Palavra de Deus.'],
    download: 'Baixe o Manna', appStore: 'Baixar na App Store', playStore: 'Disponível no Google Play',
    explore: 'Veja como o Manna funciona', features: 'Um ritmo tranquilo para cada dia',
    screens: ['Afirmações bíblicas diárias', 'Fé para cada fase', 'Pratique sem pressa'],
    alts: ['Tela inicial do Manna com uma afirmação bíblica', 'Tela de categorias do Manna com temas de fé', 'Tela de prática guiada do Manna', 'Tela de temas do Manna com opções de cores claras e escuras'],
    legalNote: 'A política de privacidade e os termos são fornecidos em inglês.', theme: 'Alterar tema de cores',
    languageLinks: 'Manna em outros idiomas', copyright: 'Todos os direitos reservados.'
  },
  fr: {
    nativeName: 'Français', ogLocale: 'fr_FR', country: 'fr', googleHl: 'fr', googleGl: 'FR',
    headline: ['Des affirmations bibliques.', 'Enracinées dans la Parole.'],
    download: 'Télécharger Manna', appStore: 'Télécharger dans l’App Store', playStore: 'Disponible sur Google Play',
    explore: 'Découvrez comment fonctionne Manna', features: 'Un rythme paisible au quotidien',
    screens: ['Des affirmations bibliques quotidiennes', 'La foi pour chaque saison', 'Pratiquez sans vous presser'],
    alts: ['Écran d’accueil de Manna avec une affirmation biblique', 'Écran des catégories de Manna avec des thèmes de foi', 'Écran de pratique guidée de Manna', 'Écran des thèmes de Manna avec des choix de couleurs claires et sombres'],
    legalNote: 'La politique de confidentialité et les conditions sont fournies en anglais.', theme: 'Changer le thème de couleur',
    languageLinks: 'Manna dans d’autres langues', copyright: 'Tous droits réservés.'
  },
  de: {
    nativeName: 'Deutsch', ogLocale: 'de_DE', country: 'de', googleHl: 'de', googleGl: 'DE',
    headline: ['Biblische Affirmationen.', 'Verwurzelt in Gottes Wort.'],
    download: 'Manna herunterladen', appStore: 'Im App Store laden', playStore: 'Bei Google Play verfügbar',
    explore: 'So funktioniert Manna', features: 'Ein ruhiger Rhythmus für jeden Tag',
    screens: ['Tägliche biblische Affirmationen', 'Glaube für jede Lebensphase', 'Übe ohne Eile'],
    alts: ['Manna-Startseite mit einer biblischen Affirmation', 'Manna-Kategorien mit glaubensbezogenen Themen', 'Geführter Übungsmodus in Manna', 'Manna-Designauswahl mit hellen und dunklen Farbvarianten'],
    legalNote: 'Datenschutzerklärung und Nutzungsbedingungen werden auf Englisch bereitgestellt.', theme: 'Farbschema wechseln',
    languageLinks: 'Manna in anderen Sprachen', copyright: 'Alle Rechte vorbehalten.'
  },
  it: {
    nativeName: 'Italiano', ogLocale: 'it_IT', country: 'it', googleHl: 'it', googleGl: 'IT',
    headline: ['Affermazioni bibliche.', 'Radicate nella Parola di Dio.'],
    download: 'Scarica Manna', appStore: 'Scarica dall’App Store', playStore: 'Disponibile su Google Play',
    explore: 'Scopri come funziona Manna', features: 'Un ritmo sereno per ogni giorno',
    screens: ['Affermazioni bibliche quotidiane', 'Fede per ogni stagione', 'Pratica senza fretta'],
    alts: ['Schermata iniziale di Manna con un’affermazione biblica', 'Schermata delle categorie di Manna con temi di fede', 'Schermata di pratica guidata di Manna', 'Schermata dei temi di Manna con colori chiari e scuri'],
    legalNote: 'L’informativa sulla privacy e i termini sono forniti in inglese.', theme: 'Cambia tema colore',
    languageLinks: 'Manna in altre lingue', copyright: 'Tutti i diritti riservati.'
  },
  pl: {
    nativeName: 'Polski', ogLocale: 'pl_PL', country: 'pl', googleHl: 'pl', googleGl: 'PL',
    headline: ['Afirmacje biblijne.', 'Zakorzenione w Słowie Bożym.'],
    download: 'Pobierz Manna', appStore: 'Pobierz w App Store', playStore: 'Pobierz z Google Play',
    explore: 'Zobacz, jak działa Manna', features: 'Spokojny rytm na każdy dzień',
    screens: ['Codzienne afirmacje biblijne', 'Wiara na każdy etap', 'Praktyka bez pośpiechu'],
    alts: ['Ekran główny Manna z afirmacją biblijną', 'Ekran kategorii Manna z tematami wiary', 'Ekran prowadzonej praktyki Manna', 'Ekran motywów Manna z jasnymi i ciemnymi wersjami kolorów'],
    legalNote: 'Polityka prywatności i warunki korzystania są dostępne w języku angielskim.', theme: 'Zmień motyw kolorów',
    languageLinks: 'Manna w innych językach', copyright: 'Wszelkie prawa zastrzeżone.'
  },
  id: {
    nativeName: 'Bahasa Indonesia', ogLocale: 'id_ID', country: 'id', googleHl: 'id', googleGl: 'ID',
    headline: ['Afirmasi Alkitabiah.', 'Berakar dalam Firman Tuhan.'],
    download: 'Unduh Manna', appStore: 'Unduh di App Store', playStore: 'Dapatkan di Google Play',
    explore: 'Lihat cara kerja Manna', features: 'Ritme yang teduh untuk setiap hari',
    screens: ['Afirmasi Alkitab harian', 'Iman untuk setiap musim', 'Berlatih tanpa terburu-buru'],
    alts: ['Layar utama Manna dengan afirmasi Alkitab', 'Layar kategori Manna dengan tema iman', 'Layar latihan terpandu Manna', 'Layar tema Manna dengan pilihan warna terang dan gelap'],
    legalNote: 'Kebijakan privasi dan ketentuan layanan tersedia dalam bahasa Inggris.', theme: 'Ubah tema warna',
    languageLinks: 'Manna dalam bahasa lain', copyright: 'Hak cipta dilindungi.'
  }
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

const locales = {};
const sources = [];
for (const [locale, spec] of Object.entries(specs)) {
  const googlePath = path.join(appRoot, 'docs/expansion/ma7/copy', `${spec.google}.json`);
  const applePath = path.join(appRoot, 'docs/expansion/ma7/copy', `${spec.apple}.json`);
  const arbPath = path.join(appRoot, 'lib/core/l10n', spec.arb);
  for (const file of [googlePath, applePath, arbPath]) {
    if (!fs.existsSync(file)) throw new Error(`Missing MA9 input: ${file}`);
    sources.push({ path: path.relative(appRoot, file), sha256: sha256(file) });
  }

  const google = readJson(googlePath);
  const apple = readJson(applePath);
  const arb = readJson(arbPath);
  const paragraphs = google.fields.fullDescription.split(/\n\n+/).map((item) => item.trim()).filter(Boolean);
  if (paragraphs.length < 7) throw new Error(`${locale} approved Google description is too short for MA9`);

  locales[locale] = {
    locale,
    ...authored[locale],
    title: google.fields.title,
    description: google.fields.shortDescription,
    promo: apple.fields.promoText,
    paragraphs,
    labels: {
      language: arb.language,
      privacy: arb.privacyPolicy,
      terms: arb.termsOfService,
      practice: arb.practice,
      reminders: arb.reminders,
      widgets: arb.widgets,
      favorites: arb.favorites,
      history: arb.history,
      mixes: arb.mixes,
      themes: arb.themes
    }
  };
}

const payload = {
  schemaVersion: 1,
  phase: 'MA9',
  generatedFrom: 'MA7 owner-approved copy and MA6 localized UI terminology',
  approvalPayloadSha256: readJson(path.join(appRoot, 'docs/expansion/ma7/approval/manifest.json')).payloadSha256,
  sources: sources.sort((a, b) => a.path.localeCompare(b.path)),
  locales
};

fs.writeFileSync(path.join(siteRoot, 'src/content.json'), `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Imported ${Object.keys(locales).length} MA9 locales into src/content.json`);
