import type { FandomPreview } from "../types/AllFandomsPageData";
import { AllFandomsContext } from "../context/AllFandomsPageContext";
import React, { type ReactNode } from "react";

interface AllFandomsProviderProps {
  children: ReactNode;
  fandomsData: FandomPreview[]; 
}

export const AllFandomsPageProvider: React.FC<AllFandomsProviderProps> = ({ 
  children,
  fandomsData 
}) => {

  const setSearchQuery = (query: string) => {
    console.log("Searching for:", query);
  };
  
  const value = {
    data: fandomsData,
    isLoading: false,
    error: undefined,
     setSearchQuery,
      // setCategory, setPage, setSortBy
  };

  return (
    <AllFandomsContext.Provider value={value}>
      {children}
    </AllFandomsContext.Provider>
  );
};