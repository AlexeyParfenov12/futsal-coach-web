import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const target = path.resolve('apps-script/Index.html');
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

let appScript = '';
const scriptMatch = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);

if (scriptMatch) {
  const jsPath = path.join(
    dist,
    scriptMatch[1].replace(/^\.\//, '').replace(/^\//, '')
  );
  const js = fs.readFileSync(jsPath, 'utf8');

  // Vite puts its module script in <head>. When we turn it into a classic
  // inline script for Apps Script it must run after #root has been parsed.
  html = html.replace(scriptMatch[0], () => '');

  // Escape only closing-script sequences that are part of bundled JS text.
  // The wrapper tag we generate below must remain a real </script> HTML tag.
  appScript = js.replace(/<\/script/gi, '<\\/script');
}

for (const match of [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g)]) {
  const cssPath = path.join(
    dist,
    match[1].replace(/^\.\//, '').replace(/^\//, '')
  );
  const css = fs.readFileSync(cssPath, 'utf8');

  // Callback replacement keeps $&, $1, $' and similar CSS text literal.
  html = html.replace(match[0], () => '<style>' + css + '</style>');
}

const diagnostics = `<script>
(function () {
  function showError(message) {
    var root = document.getElementById('root') || document.body;
    if (!root) return;
    root.innerHTML =
      '<div style="font-family:system-ui,sans-serif;padding:24px;color:#7a1f1f;background:#fff">' +
      '<h2 style="margin:0 0 10px">Futsal Coach: ошибка запуска</h2>' +
      '<pre style="white-space:pre-wrap;font-size:13px;line-height:1.5">' +
      String(message).replace(/[&<>]/g, function (ch) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;'})[ch];
      }) +
      '</pre></div>';
  }

  window.addEventListener('error', function (event) {
    showError(event.message || event.error || 'Неизвестная ошибка JavaScript');
  });

  window.addEventListener('unhandledrejection', function (event) {
    showError(event.reason && (event.reason.stack || event.reason.message || event.reason));
  });
})();
</script>`;

if (appScript) {
  const inlineApp = '<script>' + appScript + '</script>';
  const payload = diagnostics + inlineApp;

  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, () => payload + '</body>');
  } else {
    html += payload;
  }
}

// Build-time safety checks. Do not count opening "<script" text globally:
 // bundled libraries may legitimately contain that text inside JavaScript strings.
const closeScripts = (html.match(/<\/script>/gi) || []).length;
if (closeScripts < 2) {
  throw new Error('Generated HTML is missing real closing </script> tags');
}

const rootPosition = html.indexOf('id="root"');
const diagnosticsPosition = html.indexOf('<script>\n(function () {');
const finalClosePosition = html.lastIndexOf('</script>');
const bodyClosePosition = html.lastIndexOf('</body>');

if (
  rootPosition === -1 ||
  diagnosticsPosition === -1 ||
  diagnosticsPosition < rootPosition ||
  finalClosePosition === -1 ||
  bodyClosePosition === -1 ||
  finalClosePosition > bodyClosePosition
) {
  throw new Error('Generated Apps Script HTML structure is invalid');
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, html);
console.log('Generated ' + target);
console.log('Verified Apps Script HTML structure');
