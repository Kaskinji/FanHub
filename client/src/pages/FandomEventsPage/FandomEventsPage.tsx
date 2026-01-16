import { useFandomEventsPage } from "./useFandomEventsPage";
import { FandomEventsPageView } from "./FandomEventsPage.view";

const FandomEventsPage = () => {
  const state = useFandomEventsPage();
  return <FandomEventsPageView {...state} />;
};

export default FandomEventsPage;
