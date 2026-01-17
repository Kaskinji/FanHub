import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { LoginFormData } from "../../types/LoginFormData";

export const useLoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    try {
      console.log("Login attempt:", data);
      await login({
        login: data.login,
        password: data.password
      });
      console.log("Login successful");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    handleLogin,
  };
};

