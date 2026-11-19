/* PAGE HELPERS: safe HTML text and the one self-contained app file. Pure (node and browser), so the builder
   (tools/build.mjs), the design review page (tools/review.mjs) and the studio all make pages the same way. */

// Makes text safe to put inside HTML (element text or a quoted attribute).
export const escapeHtml = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Makes text safe to put inside <script>: stops "</script" or "<!--" in the data from ending the tag early.
export const scriptSafe = (text) => text.replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\!--');

// One finished app as a single HTML file: the styles, the checked spec as data, and the runtime script.
// data = { spec, findings, summary, built }; css, js and fontsLink come from the builder (or, in the studio, are baked in).
export function appPage(data, { css, js, fontsLink }) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#14213d">
<title>${String(data.spec.title).replace(/</g, '&lt;')}</title>
${fontsLink}
<style>${css}</style></head>
<body><div id="app"></div>
<script type="application/json" id="spec">${scriptSafe(JSON.stringify(data))}</script>
<script>${scriptSafe(js)}</script>
</body></html>
`;
}
