import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { User } from "../../types/AuthTypes";
import { Role } from "../../types/enums/Roles";

export const useProfilePage = () => {
  const { user, updateUser, isLoading: authLoading, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const isAdmin = user?.role === Role.Admin;

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const handleSave = (updatedUserData: Partial<User>) => {
    console.log("Saving user data:", updatedUserData);

    if (!updatedUserData || Object.keys(updatedUserData).length === 0) {
      console.log("No changes to save");
      setIsEditing(false);
      return;
    }

    const safeUpdate = {
      ...updatedUserData,
      id: user!.id,
    };

    console.log("Calling updateUser with:", safeUpdate);
    updateUser(safeUpdate);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return {
    user,
    authLoading,
    pageLoading,
    isEditing,
    isAdmin,
    handleEditClick,
    handleLogout,
    handleSave,
    handleCancel,
    navigate,
  };
};

