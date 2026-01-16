import type { FC } from "react";
import LoginForm from "../../components/AuthForm/LoginForm/LoginForm";
import type { LoginFormData } from "../../types/LoginFormData";
import styles from "./LoginPage.module.scss";

type LoginPageViewProps = {
  isLoading: boolean;
  isAuthenticated: boolean;
  handleLogin: (data: LoginFormData) => Promise<void>;
}

export const LoginPageView: FC<LoginPageViewProps> = ({
  isLoading,
  isAuthenticated,
  handleLogin,
}) => {
  if (isLoading) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.container}>
          <div>Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.container}>
          <div>Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
};

