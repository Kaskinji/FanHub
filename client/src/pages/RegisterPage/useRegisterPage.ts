import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { RegisterFormData } from "../../types/RegisterFormData";

export const useRegisterPage = () => {
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

  return {
    handleRegister,
  };
};

