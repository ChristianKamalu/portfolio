import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-scroll: returns a ref to attach and whether the element has
 * scrolled into view yet.
 *
 * The flag is React state on purpose. An earlier version added a `revealed`
 * class imperatively with `classList.add`, which React then wiped on the next
 * re-render that changed the element's className — hovering a skill chip
 * re-rendered every project card with `lit`/`dimmed` and left them all stuck
 * at `opacity: 0`.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setRevealed(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, revealed ? 'reveal revealed' : 'reveal'] as const;
}
