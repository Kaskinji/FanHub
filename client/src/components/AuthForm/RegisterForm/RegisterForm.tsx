import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import Input from "../../../components/UI/Input/Input";
import Button from "../../UI/buttons/Button/Button";
import styles from "../RegisterForm/RegisterForm.module.scss";
import type { RegisterFormData } from "../../../types/RegisterFormData";
import Logo from "../../UI/Logo/Logo"
import { useNavigate } from "react-router-dom";

interface RegisterFormProps {
    onRegister?: (data: RegisterFormData) => void;
    isLoading?: boolean;
}

const RegisterForm: FC<RegisterFormProps> = ({
    onRegister,
    isLoading = false
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError
    } = useForm<RegisterFormData>();

    const password = watch("password");

    const onSubmit = async (data: RegisterFormData) => {
        setIsSubmitting(true);

        try {
            if (data.password !== data.confirmPassword) {
                setError("confirmPassword", {
                    type: "manual",
                    message: "Passwords do not match"
                });
                return;
            }

            if (onRegister) {
                await onRegister(data);
            } else {
                console.log("Register data:", data);
                alert("Registration successful! (mock)");
            }
        } catch {
            setError("root", {
                type: "manual",
                message: "Error in registration."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const loading = isLoading || isSubmitting;

    return (
        <div className={styles.registerForm}>
            <div className={styles.header}>
                <div onClick={()=>navigate("/main")}>
                    <Logo size="large" className={styles.logo} />
                </div>
                <p className={styles.subtitle}>Create account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.inputGroup}>
                    <Input
                        type="text"
                        placeholder="Login"
                        {...register("login", {
                            required: "Login is required"
                        })}
                        className={errors.login ? styles.inputError : ""}
                    />
                    {errors.login && (
                        <span className={styles.errorMessage}>
                            {errors.login.message}
                        </span>
                    )}
                </div>

                <div className={styles.inputGroup}>
                    <Input
                        type="text"
                        placeholder="Username"
                        {...register("username", {
                            required: "Username is required",
                        })}
                        className={errors.username ? styles.inputError : ""}
                    />
                    {errors.username && (
                        <span className={styles.errorMessage}>
                            {errors.username.message}
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

                <div className={styles.inputGroup}>
                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                                value === password || "Passwords do not match"
                        })}
                        className={errors.confirmPassword ? styles.inputError : ""}
                    />
                    {errors.confirmPassword && (
                        <span className={styles.errorMessage}>
                            {errors.confirmPassword.message}
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
                    {loading ? "Register..." : "Register"}
                </Button>
            </form>
        </div>
    );
};

export default RegisterForm;