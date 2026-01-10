import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../../components/UI/Input/Input";
import Button from "../../UI/buttons/Button/Button";
import styles from "../LoginForm/LoginForm.module.scss";
import Logo from "../../UI/Logo/Logo";
import type { LoginFormData } from "../../../types/LoginFormData";
import { authApi } from "../../../api/AuthApi";

interface LoginFormProps {
  onLogin?: (data: LoginFormData, userId: number) => void;
  isLoading?: boolean;
}

const LoginForm: FC<LoginFormProps> = ({
  onLogin,
  isLoading = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Для навигации после успешного логина

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      // Отправляем запрос на сервер
      const response = await authApi.login({login: data.login, password: data.password});
      
        console.log("Login successful. User ID:", response);
        localStorage.setItem("user_id", response.toString());
        if (onLogin) {
          await onLogin(data, response);
        }
        
        navigate("/main");
      

    } catch (error) {
      // Обработка ошибок
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Сервер ответил с ошибкой
          switch (error.response.status) {
            case 400:
              setError("root", {
                type: "manual",
                message: "Invalid login or password format."
              });
              break;
            case 401:
              setError("root", {
                type: "manual",
                message: "Invalid username or password."
              });
              break;
            case 404:
              setError("root", {
                type: "manual",
                message: "User not found."
              });
              break;
            case 500:
              setError("root", {
                type: "manual",
                message: "Server error. Please try again later."
              });
              break;
            default:
              setError("root", {
                type: "manual",
                message: error.response.data?.message || "Login failed. Please try again."
              });
          }
        } else if (error.request) {
          setError("root", {
            type: "manual",
            message: "Network error. Please check your connection."
          });
        } else {
          // Что-то пошло не так при настройке запроса
          setError("root", {
            type: "manual",
            message: "An unexpected error occurred."
          });
        }
      } else {
        // Не axios ошибка
        setError("root", {
          type: "manual",
          message: "An unexpected error occurred."
        });
      }
      
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = isLoading || isSubmitting;

  return (
    <div className={styles.loginForm}>
      <div className={styles.header}>
        <Link to="/">
          <Logo size="large" className={styles.logo} />
        </Link>
        <p className={styles.subtitle}>Sign In</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputGroup}>
          <Input
            type="text"
            placeholder="Login"
            {...register("login", {
              required: "Login is required",
              minLength: {
                value: 3,
                message: "Login must be at least 3 characters long"
              },
              maxLength: {
                value: 20,
                message: "Login must be less than 20 characters"
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Login can only contain eng letters, numbers and underscores"
              }
            })}
            className={errors.login ? styles.inputError : ""}
            disabled={loading}
          />
          {errors.login && (
            <span className={styles.errorMessage}>
              {errors.login.message}
            </span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <Input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long"
              }
            })}
            className={errors.password ? styles.inputError : ""}
            disabled={loading}
          />
          {errors.password && (
            <span className={styles.errorMessage}>
              {errors.password.message}
            </span>
          )}
        </div>

        {errors.root && (
          <div className={styles.rootError}>
            {errors.root.message}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className={styles.footer}>
          <span className={styles.footerText}>
            Don't you have an account?{" "}
            <Link to="/registration" className={styles.link}>
              Join to us
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;