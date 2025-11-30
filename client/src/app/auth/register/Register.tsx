import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../../components/AuthForm/RegisterForm/RegisterForm";
import type { RegisterFormData } from "../../../types/Auth";
import styles from "../register/Register.module.scss";

const RegisterPage: FC = () => {
    const navigate = useNavigate();

    const handleRegister = async (data: RegisterFormData) => {
        try {
            // TODO: Заменить на реальный API вызов
            console.log("Register attempt:", data);

            // Симуляция успешного логина
            // const response = await authService.Register(data);
            // localStorage.setItem("token", response.token);

            // Перенаправление на главную
            navigate("/");
        } catch (error) {
            console.error("Register failed:", error);
            throw error; // Пробрасываем ошибку для обработки в форме
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