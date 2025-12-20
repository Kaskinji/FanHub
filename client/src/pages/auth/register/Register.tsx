import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../../components/AuthForm/RegisterForm/RegisterForm";
import type { RegisterFormData } from "../../../types/RegisterFormData";
import styles from "../register/Register.module.scss";

const RegisterPage: FC = () => {
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterFormData) => {
    try {
      console.log("Register attempt:", data);

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
