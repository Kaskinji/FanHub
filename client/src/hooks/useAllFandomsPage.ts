import { useContext } from "react";
import { AllFandomsContext } from "../context/AllFandomsPageContext";

export const useAllFandoms = () => {
  const context = useContext(AllFandomsContext);
  
  if (!context) {
    throw new Error(
      "useAllFandoms must be used within AllFandomsProvider"
    );
  }
  
  return context;
};