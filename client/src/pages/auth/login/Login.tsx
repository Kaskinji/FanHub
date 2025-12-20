import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../../components/AuthForm/LoginForm/LoginForm";
import type { LoginFormData } from "../../../types/LoginFormData";
import styles from "../login/Login.module.scss";

const LoginPage: FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormData) => {
    try {
      console.log("Login attempt:", data);

      navigate("/");
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
