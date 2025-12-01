import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type SetStateAction<S> = (prevState: S) => S;

type CollapsibleContextType = {
  activeId: string | null;
  setActiveId: (id: string | null | SetStateAction<string | null>) => void;
};

const CollapsibleContext = createContext<CollapsibleContextType | undefined>(undefined);

export function CollapsibleProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <CollapsibleContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </CollapsibleContext.Provider>
  );
}

export function useCollapsible(id: string, defaultExpanded = false) {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('useCollapsible must be used within a CollapsibleProvider');
  }

  const { activeId, setActiveId } = context;
  const isActive = activeId === id;
  
  // Set the first banner as active by default if no banner is active and defaultExpanded is true
  React.useEffect(() => {
    if (defaultExpanded && activeId === null) {
      setActiveId(id);
    }
  }, []);

  const toggle = () => {
    setActiveId(prevId => prevId === id ? null : id);
  };

  return {
    isActive,
    toggle,
  };
}
