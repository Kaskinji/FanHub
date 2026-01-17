import { useLoginPage } from "./useLoginPage";
import { LoginPageView } from "./LoginPage.view";

const LoginPage = () => {
  const state = useLoginPage();
  return <LoginPageView {...state} />;
};

export default LoginPage;
