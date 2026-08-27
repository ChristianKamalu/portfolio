import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.tsx';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// A production build is prerendered (see scripts/prerender.mjs), so #root
// already holds the whole page and the job is to adopt it. `npm run dev`
// serves the untouched index.html, where #root is empty and hydrating would
// mismatch — so branch on what is actually there rather than on the mode.
// firstElementChild, not firstChild: a stray newline inside the div in
// index.html would make firstChild a text node and send dev mode down the
// hydrate path against an empty root.
if (container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
