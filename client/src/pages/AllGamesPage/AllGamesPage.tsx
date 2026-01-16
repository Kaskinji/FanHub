import { useAllGamesPage } from "./useAllGamesPage";
import { AllGamesPageView } from "./AllGamesPage.view";

const AllGamesPage = () => {
  const state = useAllGamesPage();
  return <AllGamesPageView {...state} />;
};

export default AllGamesPage;
