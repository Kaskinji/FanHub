import type { FC } from "react";
import RegisterForm from "../../components/AuthForm/RegisterForm/RegisterForm";
import type { RegisterFormData } from "../../types/RegisterFormData";
import styles from "./RegisterPage.module.scss";

type RegisterPageViewProps = {
  handleRegister: (data: RegisterFormData) => Promise<void>;
}

export const RegisterPageView: FC<RegisterPageViewProps> = ({
  handleRegister,
}) => {
  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        <RegisterForm onRegister={handleRegister} />
      </div>
    </div>
  );
};

