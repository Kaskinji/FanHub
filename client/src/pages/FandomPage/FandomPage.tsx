import { useFandomPage } from "./useFandomPage";
import { FandomPageView } from "./FandomPage.view";

const FandomPage = () => {
  const state = useFandomPage();
  return <FandomPageView {...state} />;
};

export default FandomPage;
