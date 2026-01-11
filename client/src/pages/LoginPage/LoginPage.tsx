import { type FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/AuthForm/LoginForm/LoginForm";
import type { LoginFormData } from "../../types/LoginFormData";
import styles from "./LoginPage.module.scss";
import { useAuth } from "../../hooks/useAuth";

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

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

  const handleLogin = async (data: LoginFormData) => {
    try {
      console.log("Login attempt:", data);
      
      await login({
        login: data.login,
        password: data.password
      });
      
      console.log("Login successful");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;