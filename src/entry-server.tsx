import { renderToString } from 'react-dom/server';
import App from './App';

/**
 * Build-time entry point. `scripts/prerender.mjs` calls this and drops the
 * markup into `#root` in dist/index.html, so the deployed page ships the whole
 * page as HTML instead of an empty div.
 *
 * Nothing here touches the DOM: every browser API in the tree lives in a
 * `useEffect` or an event handler, and every `useState` initial value is a
 * constant. That is what makes the client able to hydrate this markup rather
 * than throw it away and re-render — keep it that way, or the first paint
 * starts flashing.
 */
export function render() {
  return renderToString(<App />);
}
