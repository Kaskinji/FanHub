import { useAllFandomsPage } from "./useAllFandomsPage";
import { AllFandomsPageView } from "./AllFandomsPage.view";

const AllFandomsPage = () => {
  const state = useAllFandomsPage();
  return <AllFandomsPageView {...state} />;
};

export default AllFandomsPage;
