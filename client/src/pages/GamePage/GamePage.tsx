import { useGamePage } from "./useGamePage";
import { GamePageView } from "./GamePage.view";

const GamePage = () => {
  const state = useGamePage();
  return <GamePageView {...state} />;
};

export default GamePage;
