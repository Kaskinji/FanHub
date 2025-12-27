import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/AuthForm/RegisterForm/RegisterForm";
import type { RegisterFormData } from "../../types/RegisterFormData";
import styles from "./RegisterPage.module.scss";
import { useAuth } from "../../hooks/useAuth";

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const handleRegister = async (data: RegisterFormData) => {
    try {
      auth.register({
        login: data.login,
        username: data.username,
        password: data.password,
        avatar: undefined,
      });

      navigate("/");
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        <RegisterForm onRegister={handleRegister} />
      </div>
    </div>
  );
};

export default RegisterPage;
