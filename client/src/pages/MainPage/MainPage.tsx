import type { FC } from "react";
import { useMainPage } from "./useMainPage";
import { MainPageView } from "./MainPage.view";

type MainPageProps = {
  onSearch: () => void;
};

const MainPage: FC<MainPageProps> = ({ onSearch = () => {} }) => {
  const state = useMainPage({ onSearch });
  return <MainPageView {...state} />;
};

export default MainPage;
