import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface HighlightContextType {
  /** The skill lighting up cards right now — the pin if there is one, else the hover. */
  highlightedSkill: string | null;
  /** Set by a click or a tap, and survives the pointer leaving. */
  pinnedSkill: string | null;
  /** Transient: a mouse hover or a keyboard focus. */
  hoverSkill: (skill: string | null) => void;
  togglePin: (skill: string) => void;
  clearPin: () => void;
}

const HighlightContext = createContext<HighlightContextType>({
  highlightedSkill: null,
  pinnedSkill: null,
  hoverSkill: () => {},
  togglePin: () => {},
  clearPin: () => {},
});

export const useHighlight = () => useContext(HighlightContext);

/**
 * Hovering, focusing or tapping a tech chip lights up every project card that
 * uses it.
 *
 * The two states are deliberately separate. A hover is transient and can be
 * lost without warning — iOS synthesises `mouseenter` on a tap and only fires
 * the matching `mouseleave` when you touch something *else*, so a single state
 * toggled by both would either stick on (every card dimmed until you tap
 * elsewhere) or be cleared by the tap's own click a moment after the hover set
 * it. The pin is only ever changed by an explicit click/tap, so it is immune to
 * whatever the synthetic mouse events do around it, and it takes precedence
 * because it is the deliberate choice of the two.
 */
export function HighlightProvider({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinnedSkill, setPinnedSkill] = useState<string | null>(null);

  const hoverSkill = useCallback((skill: string | null) => setHovered(skill), []);
  const togglePin = useCallback(
    (skill: string) => setPinnedSkill((cur) => (cur === skill ? null : skill)),
    [],
  );
  const clearPin = useCallback(() => setPinnedSkill(null), []);

  const value = useMemo(
    () => ({
      highlightedSkill: pinnedSkill ?? hovered,
      pinnedSkill,
      hoverSkill,
      togglePin,
      clearPin,
    }),
    [pinnedSkill, hovered, hoverSkill, togglePin, clearPin],
  );

  return <HighlightContext.Provider value={value}>{children}</HighlightContext.Provider>;
}
