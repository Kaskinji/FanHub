import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Input from "../../../components/UI/Input/Input";
import Button from "../../UI/Button/Button";
import styles from "../LoginForm/LoginForm.module.scss";
import Logo from "../../UI/Logo/Logo"
import type { LoginFormData } from "../../../types/Auth";

interface LoginFormProps {
    onLogin?: (data: LoginFormData) => void;
    isLoading?: boolean;
}

const LoginForm: FC<LoginFormProps> = ({
    onLogin,
    isLoading = false
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);

        try {
            // Симуляция API запроса
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (onLogin) {
                await onLogin(data);
            } else {
                console.log("Login data:", data);
                // Здесь будет интеграция с вашим бэкендом
            }
        } catch (error) {
            setError("root", {
                type: "manual",
                message: "Ошибка при входе. Проверьте данные."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const loading = isLoading || isSubmitting;

    return (
        <div className={styles.loginForm}>
            <div className={styles.header}>        
                <Link to="/main">
                    <Logo size="large" className={styles.logo} />
                </Link>
                <p className={styles.subtitle}>Sign In</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.inputGroup}>
                    <Input
                        type="email"
                        placeholder="Your@email.com"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Uncorrect email"
                            }
                        })}
                        className={errors.email ? styles.inputError : ""}
                    />
                    {errors.email && (
                        <span className={styles.errorMessage}>
                            {errors.email.message}
                        </span>
                    )}
                </div>

                <div className={styles.inputGroup}>
                    <Input
                        type="password"
                        placeholder="Your password"
                        {...register("password", {
                            required: "password is required",
                            minLength: {
                                value: 6,
                                message: "The password must be at least 6 characters long"
                            }
                        })}
                        className={errors.password ? styles.inputError : ""}
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
                    {loading ? "Login..." : "Login"}
                </Button>

                <div className={styles.footer}>
                    <span className={styles.footerText}>
                        Don't you have an account?{" "}
                        <Link to="/Registration" className={styles.link}>
                            Join to us
                        </Link>
                    </span>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;