import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const appRoot = process.env.MANNA_APP_ROOT || path.resolve(root, '../../vibe/manna');
const publication = JSON.parse(fs.readFileSync(path.join(root, 'src/publication.json'), 'utf8'));
const shots = { home: 1, categories: 2, practice: 3, themes: 6 };

function magick(...args) {
  execFileSync('magick', args, { cwd: root, stdio: 'inherit' });
}

fs.mkdirSync(path.join(root, 'assets/og'), { recursive: true });
magick('assets/app-icon.png', '-resize', '32x32', 'assets/favicon-32.png');
magick('assets/app-icon.png', '-resize', '180x180', 'assets/apple-touch-icon.png');
magick('assets/app-icon.png', '-define', 'icon:auto-resize=64,48,32,16', 'assets/favicon.ico');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manna-ma9-assets-'));
try {
  const iconLayer = path.join(tempDir, 'icon.png');
  magick('assets/app-icon.png', '-resize', '190x190', iconLayer);

  for (const locale of publication.publishedLocales) {
    const outputDir = path.join(root, 'assets/screenshots', locale);
    fs.mkdirSync(outputDir, { recursive: true });
    for (const [name, preset] of Object.entries(shots)) {
      const source = path.join(appRoot, 'tools/screenshot-generator/data/images', `${preset}-phone-${locale}.png`);
      if (!fs.existsSync(source)) throw new Error(`Missing approved localized screenshot: ${source}`);
      magick(source, '-resize', '720x>', '-quality', '82', path.join(outputDir, `${name}.webp`));
    }

    const phoneLayer = path.join(tempDir, `phone-${locale}.png`);
    magick(
      `assets/screenshots/${locale}/home.webp`,
      '-resize', '300x>',
      '-gravity', 'north',
      '-crop', '300x620+0+0',
      '+repage',
      phoneLayer
    );
    magick(
      '-size', '1200x630', 'gradient:#fffdf9-#efe3d0',
      '-fill', '#f3d993', '-draw', 'circle 1070,90 790,90',
      '-fill', '#a87419', '-draw', 'roundrectangle 70,70 88,560 9,9',
      iconLayer, '-geometry', '+125+105', '-composite',
      '-font', '/System/Library/Fonts/NewYork.ttf', '-pointsize', '112', '-fill', '#2a211b', '-annotate', '+125+445', 'Manna',
      phoneLayer, '-geometry', '+825+8', '-composite',
      '-strip', `assets/og/${locale}.png`
    );
  }
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

console.log(`Built optimized screenshots and localized social cards for ${publication.publishedLocales.length} locales`);
