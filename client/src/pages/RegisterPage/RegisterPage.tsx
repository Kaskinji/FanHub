import { useRegisterPage } from "./useRegisterPage";
import { RegisterPageView } from "./RegisterPage.view";

const RegisterPage = () => {
  const state = useRegisterPage();
  return <RegisterPageView {...state} />;
};

export default RegisterPage;
