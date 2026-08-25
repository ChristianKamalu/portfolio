import type { ReactNode } from 'react';

/**
 * Hand-rolled icon set — no icon library, same as every other animation here.
 *
 * House rules so the family stays coherent: one 24x24 grid, geometry drawn as
 * strokes (fills only for pips/carets), `currentColor` everywhere so icons
 * inherit whatever the surrounding CSS already sets. Curves are cubics rather
 * than arcs — arc sweep flags are easy to get backwards and impossible to read
 * later.
 */
export type IconName =
  | 'dice'
  | 'poke'
  | 'wrap'
  | 'ramen'
  | 'salad'
  | 'taco'
  | 'check'
  | 'caret'
  | 'arrow';

// Shared bowl, so the three bowl-based meals sit on exactly the same curve.
const BOWL = (
  <>
    <path d="M3.2 11.6H20.8" />
    <path d="M4.6 11.6C4.6 16.3 7.9 19.8 12 19.8C16.1 19.8 19.4 16.3 19.4 11.6" />
  </>
);

const GLYPHS: Record<IconName, ReactNode> = {
  // A die mid-turn: the 3-face reads at 14px where a 5-face turns to mush.
  dice: (
    <>
      <rect x="3.9" y="3.9" width="16.2" height="16.2" rx="4.2" />
      <circle cx="8.7" cy="8.7" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15.3" cy="15.3" r="1.25" fill="currentColor" stroke="none" />
    </>
  ),

  // Poke bowl — cubed fish stacked over the rim.
  poke: (
    <>
      {BOWL}
      <rect x="5.8" y="6.9" width="4.5" height="4.5" rx="1.3" />
      <rect x="13.7" y="6.9" width="4.5" height="4.5" rx="1.3" />
      <rect x="9.75" y="2.9" width="4.5" height="4.5" rx="1.3" />
    </>
  ),

  // Wrap — a tortilla cylinder on the diagonal with the tucked end folded in.
  wrap: (
    <g transform="rotate(-38 12 12)">
      <rect x="8" y="2.6" width="8" height="18.8" rx="4" />
      <path d="M8 7.1H16" />
      <path d="M8.6 9.6H15.4" />
      <path d="M9.6 13.4C11.4 14.6 12.6 15.6 14.4 16.4" />
    </g>
  ),

  // Ramen — noodle lift over the broth, egg halved beside it.
  ramen: (
    <>
      {BOWL}
      <path d="M4.9 10.1C6.5 7.8 8.3 11.2 9.9 9.1C11.5 7 13.2 10.3 14.6 8.7" />
      <circle cx="17.3" cy="9.5" r="2.1" />
      <circle cx="17.3" cy="9.5" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),

  // Salad — leaves overflowing a shallower bowl.
  salad: (
    <>
      {BOWL}
      <path d="M12 10.4C12 7.6 13.9 5.4 16.4 5.4C16.4 8.2 14.5 10.4 12 10.4Z" />
      <path d="M12 10.4C12 7.6 10.1 5.4 7.6 5.4C7.6 8.2 9.5 10.4 12 10.4Z" />
      <path d="M12 10.4V7.2" />
    </>
  ),

  // Taco — folded shell, filling cresting the top edge.
  taco: (
    <g transform="rotate(-9 12 12)">
      <path d="M4.5 9.1C4.5 18.1 19.5 18.1 19.5 9.1" />
      <path d="M3.9 8.4C6.2 6.1 8.7 9.2 11.1 7.1C13.5 5 15.9 8.1 18.6 6.8" />
      <path d="M8.9 11.1C10.4 12.2 13.4 12.4 15.1 11.3" />
    </g>
  ),

  check: <path d="M4.8 12.6L9.4 17.2L19.2 6.9" />,

  // Faithful stand-in for the ▸ that used to bullet these lists.
  caret: <path d="M9.4 5.6L15.8 12L9.4 18.4Z" fill="currentColor" stroke="none" />,

  arrow: (
    <>
      <path d="M4.5 12H18" />
      <path d="M13 7L18 12L13 17" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  /** Rendered px box; the 24-grid scales into it. */
  size?: number;
  className?: string;
  /** Supply only when the icon carries meaning no nearby text already gives. */
  label?: string;
}

export default function Icon({ name, size = 16, className, label }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {label && <title>{label}</title>}
      {GLYPHS[name]}
    </svg>
  );
}
