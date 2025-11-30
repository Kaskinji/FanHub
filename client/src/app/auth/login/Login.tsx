import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../../components/AuthForm/LoginForm/LoginForm";
import type { LoginFormData } from "../../../types/Auth";
import styles from "../login/Login.module.scss";

const LoginPage: FC = () => {
    const navigate = useNavigate();

    const handleLogin = async (data: LoginFormData) => {
        try {
            // TODO: Заменить на реальный API вызов
            console.log("Login attempt:", data);

            // Симуляция успешного логина
            // const response = await authService.login(data);
            // localStorage.setItem("token", response.token);

            // Перенаправление на главную
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Пробрасываем ошибку для обработки в форме
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