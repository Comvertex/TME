#!/usr/bin/env node
/**
 * Mobile horizontal-overflow guard for the TME homepage.
 *
 * Why this exists: the redesign's mobile header overflowed the viewport, which
 * pushed the fixed right-anchored WhatsApp float off-screen. Browser DevTools
 * device-mode (and some preview emulators) can mis-report the layout width, so
 * this checks against a REAL headless Chromium at true 375 / 390 px.
 *
 * Checks (fail => exit 1):
 *   - 375 & 390 px, banner visible AND dismissed:
 *       scrollWidth === clientWidth (zero horizontal scroll)
 *       no element extends past the viewport
 *       header: logo + nav CTA + hamburger all in-view
 *       WhatsApp float in-view; clear of the banner when shown; at the corner
 *       when dismissed
 *   - 1280 px desktop sanity: no scroll; nav links shown, hamburger hidden
 *
 * Requirements (intentionally NOT committed as repo deps so Netlify's
 * `publish = "."` build never installs/serves node_modules):
 *   - Google Chrome installed (override path with CHROME_PATH=...)
 *   - puppeteer-core resolvable. Easiest:
 *         npm i -g puppeteer-core           # then: node scripts/check-overflow.mjs
 *     or  NODE_PATH=/path/with/node_modules node scripts/check-overflow.mjs
 *
 * Usage: node scripts/check-overflow.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2',
  '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain',
};

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean);
  return candidates.find((p) => { try { return fs.existsSync(p); } catch { return false; } });
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let rel = decodeURIComponent((req.url || '/').split('?')[0]);
      if (rel === '/') rel = '/index.html';
      const fp = path.join(ROOT, rel);
      if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
        res.statusCode = 404; res.end('not found'); return;
      }
      res.setHeader('Content-Type', MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream');
      fs.createReadStream(fp).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

// Runs in the page. Returns measurements + a list of offenders past the viewport.
function pageProbe() {
  const de = document.documentElement;
  const cw = de.clientWidth, ch = de.clientHeight;
  const inView = (r) => r.left >= -1 && r.right <= cw + 1 && r.top >= -1 && r.bottom <= ch + 1;
  const offenders = [...document.querySelectorAll('*')]
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter((o) => o.r.right > cw + 1 && o.r.width > 0)
    .sort((a, b) => b.r.right - a.r.right)
    .slice(0, 8)
    .map((o) => ({ tag: o.el.tagName, cls: String(o.el.className || ''), right: Math.round(o.r.right) }));

  const float = document.querySelector('.whatsapp-float');
  const banner = document.getElementById('consent-banner');
  const fr = float.getBoundingClientRect();
  const br = banner.getBoundingClientRect();
  const bannerVisible = banner.style.display === 'block';
  const overlap = bannerVisible && !(fr.right <= br.left || fr.left >= br.right || fr.bottom <= br.top || fr.top >= br.bottom);

  const logo = document.querySelector('.navbar__logo');
  const navCta = document.querySelector('.navbar__inner > .tme-btn--nav');
  const toggle = document.getElementById('navToggle');
  const navbar = document.getElementById('navbar');
  const nbr = navbar.getBoundingClientRect();
  const ctaR = navCta.getBoundingClientRect();
  const brand = document.querySelector('.hero__brand');
  const phone = document.querySelector('.topbar__phone');

  return {
    cw, ch, sw: de.scrollWidth, noHScroll: de.scrollWidth === cw,
    offenders,
    bannerVisible,
    floatInView: inView(fr), overlap, floatBottom: float.style.bottom,
    logoInView: inView(logo.getBoundingClientRect()),
    navCtaShown: getComputedStyle(navCta).display !== 'none' && inView(ctaR),
    navCtaText: navCta.textContent.trim(),
    // not clipped by the navbar's max-height/overflow:hidden
    navCtaWithinNavbar: ctaR.top >= nbr.top - 1 && ctaR.bottom <= nbr.bottom + 1 &&
                        ctaR.left >= nbr.left - 1 && ctaR.right <= nbr.right + 1,
    toggleShown: getComputedStyle(toggle).display !== 'none' && inView(toggle.getBoundingClientRect()),
    brandText: brand ? brand.textContent.trim() : '',
    brandShown: brand ? (getComputedStyle(brand).display !== 'none' && brand.getBoundingClientRect().width > 0) : false,
    phoneFont: parseFloat(getComputedStyle(phone).fontSize),
  };
}

const fails = [];
function expect(cond, msg) { if (!cond) fails.push(msg); }

async function run() {
  const chrome = findChrome();
  if (!chrome) { console.error('ERROR: Chrome not found. Set CHROME_PATH.'); process.exit(2); }

  let puppeteer;
  try { puppeteer = (await import('puppeteer-core')).default; }
  catch {
    console.error('ERROR: puppeteer-core not resolvable.\n' +
      '  Install:  npm i -g puppeteer-core\n' +
      '  or run:   NODE_PATH=/path/with/node_modules node scripts/check-overflow.mjs');
    process.exit(2);
  }

  const { server, port } = await startServer();
  const url = `http://127.0.0.1:${port}/index.html`;
  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox'] });

  try {
    // ---- Mobile widths ----
    for (const width of [360, 375, 390]) {
      const page = await browser.newPage();
      await page.setViewport({ width, height: 800, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      await page.goto(url, { waitUntil: 'networkidle2' });
      await page.evaluate(() => { try { localStorage.removeItem('cookieConsent'); } catch {} });
      await page.goto(url, { waitUntil: 'networkidle2' });
      await page.evaluate(() => (document.fonts && document.fonts.ready) ? document.fonts.ready : null);
      await new Promise((r) => setTimeout(r, 400));

      const shown = await page.evaluate(pageProbe);
      await page.evaluate(() => document.getElementById('refuse-btn').click());
      await new Promise((r) => setTimeout(r, 150));
      const dismissed = await page.evaluate(pageProbe);

      for (const [state, m] of [['banner-shown', shown], ['banner-dismissed', dismissed]]) {
        const at = `@${width} ${state}`;
        expect(m.noHScroll, `${at}: horizontal scroll (sw=${m.sw} cw=${m.cw})`);
        expect(m.offenders.length === 0, `${at}: offenders ${JSON.stringify(m.offenders)}`);
        expect(m.logoInView, `${at}: logo not in view`);
        expect(m.navCtaShown, `${at}: nav CTA not visible/in-view`);
        expect(m.navCtaText === 'Richiedi Preventivo', `${at}: nav CTA label not full ("${m.navCtaText}")`);
        expect(m.navCtaWithinNavbar, `${at}: nav CTA clipped by navbar`);
        expect(m.toggleShown, `${at}: hamburger not visible/in-view`);
        expect(m.floatInView, `${at}: WhatsApp float not in viewport`);
        expect(m.brandShown && /Taxi Merci Express/.test(m.brandText), `${at}: hero brand text missing/hidden`);
        expect(m.phoneFont >= 18, `${at}: top-bar phone font too small (${m.phoneFont}px)`);
      }
      expect(shown.overlap === false, `@${width} banner-shown: float overlaps banner`);
      expect(dismissed.floatBottom === '22px', `@${width} dismissed: float not back at 22px (${dismissed.floatBottom})`);
      console.log(`@${width}: nav CTA="${shown.navCtaText}" floatBottom(shown)=${shown.floatBottom} offenders=${shown.offenders.length}`);
      await page.close();
    }

    // ---- Desktop sanity ----
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 850, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle2' });
    const d = await page.evaluate(() => {
      const de = document.documentElement;
      return {
        noHScroll: de.scrollWidth === de.clientWidth,
        navLinks: getComputedStyle(document.querySelector('.navbar__links')).display,
        toggle: getComputedStyle(document.getElementById('navToggle')).display,
        navCta: getComputedStyle(document.querySelector('.navbar__inner > .tme-btn--nav')).display,
      };
    });
    expect(d.noHScroll, `@1280: horizontal scroll`);
    expect(d.navLinks !== 'none', `@1280: nav links hidden`);
    expect(d.toggle === 'none', `@1280: hamburger shown on desktop`);
    expect(d.navCta !== 'none', `@1280: inline nav CTA hidden on desktop`);
    console.log(`@1280: navLinks=${d.navLinks} toggle=${d.toggle} navCta=${d.navCta}`);
    await page.close();
  } finally {
    await browser.close();
    server.close();
  }

  if (fails.length) {
    console.error('\nFAIL:\n' + fails.map((f) => '  - ' + f).join('\n'));
    process.exit(1);
  }
  console.log('\nPASS: no mobile horizontal overflow; header + float correct; desktop intact.');
}

run().catch((e) => { console.error('FATAL', e); process.exit(1); });
