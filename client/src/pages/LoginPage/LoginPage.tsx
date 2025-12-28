import { type FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/AuthForm/LoginForm/LoginForm";
import type { LoginFormData } from "../../types/LoginFormData";
import styles from "./LoginPage.module.scss";
import { useAuth } from "../../hooks/useAuth"; // Рекомендуется использовать хук

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuth(); // Используем хук

  // Эффект для перенаправления если уже авторизован
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Показываем лоадер пока проверяем аутентификацию
  if (isLoading) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.container}>
          <div>Checking authentication...</div>
        </div>
      </div>
    );
  }

  // Если уже авторизован, показываем редирект
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
      
      // Используем login из контекста
      await login({
        login: data.login, // Убедитесь, что поля совпадают
        password: data.password
      });
      
      // После успешного логина navigate сработает в useEffect
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Пробрасываем ошибку форме
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