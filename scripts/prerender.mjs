/**
 * Injects the prerendered markup into dist/index.html.
 *
 * Runs after both Vite builds: the client build writes dist/index.html (with
 * the JSON-LD already injected by the structuredData plugin), the SSR build
 * writes .ssr/entry-server.js, and this stitches them together.
 *
 * Deliberately not a Vite plugin — a plugin would have to run inside the
 * client build, which is exactly when the SSR bundle does not exist yet.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const HTML = resolve('dist/index.html');
const PLACEHOLDER = '<div id="root"></div>';

const { render } = await import(pathToFileURL(resolve('.ssr/entry-server.js')).href);

const template = readFileSync(HTML, 'utf8');
if (!template.includes(PLACEHOLDER)) {
  throw new Error(
    `prerender: "${PLACEHOLDER}" not found in dist/index.html — index.html changed shape, ` +
      'so nothing would be prerendered and the failure would be silent.',
  );
}

const markup = render();
if (!markup.trim()) throw new Error('prerender: render() returned nothing.');

writeFileSync(HTML, template.replace(PLACEHOLDER, `<div id="root">${markup}</div>`));

const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(1)} kB`;
console.log(`prerendered ${kb(markup)} of markup into dist/index.html`);
