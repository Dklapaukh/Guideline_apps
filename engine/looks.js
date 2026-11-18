/* LOOKS AND BRANDING: the design "looks" every app carries, and helpers to apply them. Pure (node and browser).
   A look is one stylesheet in engine/looks/<id>.css that only restyles. Every built app embeds all looks, each
   scoped to html[data-look="<id>"], so the person using the app can switch look without a rebuild.
   A template can name a company brand ("Brand:", "Brand colour:"); the colour replaces the look's action colour. */

// The looks on offer, in the order shown. The first is the default (the owner's favourite in review round 1).
export const LOOKS = [
  { id: 'clinic', name: 'Clinic', from: 'Patient and wellbeing apps: calm cards, one teal action colour, soft and friendly.',
    fonts: 'family=Inter:wght@400;600;700' },
  { id: 'wayfinding', name: 'Wayfinding', from: 'Transit maps and road signs: bold type, actions as stations on a line, sign-yellow cautions.',
    fonts: 'family=Archivo:wght@500;700;800;900' },
  { id: 'flightdeck', name: 'Flight deck', from: 'Aviation checklists and cockpit displays: dark, high contrast, built for stress and low light.',
    fonts: 'family=IBM+Plex+Sans:wght@400;500;700&family=IBM+Plex+Sans+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@500' },
];
export const DEFAULT_LOOK = LOOKS[0].id;

// Rewrites a look's stylesheet so it applies only under html[data-look="id"].
// Handles the simple CSS the looks use (plain rules, no @media blocks): ":root"/"html" become the scoped html,
// "body" and every other selector are placed inside it. The extra attribute also makes a look beat the base sheet.
export function scopeLook(css, id) {
  const root = `html[data-look="${id}"]`;
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/([^{}]+)\{([^{}]*)\}/g, (all, selectors, body) => {
    const scoped = selectors.split(',').map((s) => s.trim()).filter(Boolean).map((s) =>
      s === ':root' || s === 'html' ? root : s.startsWith(':root') ? root + s.slice(5) : `${root} ${s}`).join(', ');
    return `${scoped}{${body}}`;
  });
}

// One Google Fonts link for every look (the CSS files list fallbacks, so the apps still work offline).
export const fontsHref = () => 'https://fonts.googleapis.com/css2?' + LOOKS.map((l) => l.fonts).join('&') + '&display=swap';

// Reads a colour written as #abc or #aabbcc. Returns [r, g, b] (0-255) or null.
export function parseColour(text) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(text ?? '').trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
// Contrast of white text on a colour (WCAG formula; 4.5 or more reads well for normal text).
export function contrastWithWhite([r, g, b]) {
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return 1.05 / (L + 0.05);
}
