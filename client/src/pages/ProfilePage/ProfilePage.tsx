import { useProfilePage } from "./useProfilePage";
import { ProfilePageView } from "./ProfilePage.view";

export const ProfilePage = () => {
  const state = useProfilePage();
  return <ProfilePageView {...state} />;
};
