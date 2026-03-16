import React, { createContext, useContext, useState } from "react";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareIds, setCompareIds] = useState([]);

  const toggleCompare = (id) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const isInCompare = (id) => compareIds.includes(id);

  return (
    <CompareContext.Provider value={{ compareIds, toggleCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}