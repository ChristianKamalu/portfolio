import { createContext, useContext, useState, type ReactNode } from 'react';

interface HighlightContextType {
  hoveredSkill: string | null;
  setHoveredSkill: (skill: string | null) => void;
}

const HighlightContext = createContext<HighlightContextType>({
  hoveredSkill: null,
  setHoveredSkill: () => {},
});

export const useHighlight = () => useContext(HighlightContext);

/** Hovering a skill chip lights up every project card that uses it. */
export function HighlightProvider({ children }: { children: ReactNode }) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  return (
    <HighlightContext.Provider value={{ hoveredSkill, setHoveredSkill }}>
      {children}
    </HighlightContext.Provider>
  );
}
