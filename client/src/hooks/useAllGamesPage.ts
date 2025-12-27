export const useAllGames = () => {
   const setSearchQuery = (query: string) => {
    console.log("Searching for:", query);
  };
  
  
  return { setSearchQuery};
};