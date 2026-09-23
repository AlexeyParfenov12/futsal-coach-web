import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const target = path.resolve('apps-script/Index.html');
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const scriptMatch = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
if (scriptMatch) {
  const jsPath = path.join(dist, scriptMatch[1].replace(/^\.\//, '').replace(/^\//, ''));
  const js = fs.readFileSync(jsPath, 'utf8');
  html = html.replace(scriptMatch[0], '<script>' + js + '</script>');
}

for (const match of [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g)]) {
  const cssPath = path.join(dist, match[1].replace(/^\.\//, '').replace(/^\//, ''));
  const css = fs.readFileSync(cssPath, 'utf8');
  html = html.replace(match[0], '<style>' + css + '</style>');
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, html);
console.log('Generated ' + target);
