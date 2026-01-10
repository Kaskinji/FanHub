import { useState, type FC, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import styles from "./ProfilePage.module.scss";
import Header from "../../components/Header/Header";
import { ProfileCard } from "./ProfileCard/ProfileCard";
import { ProfileEditCard } from "./ProfileEditCard/ProfileEditCard";
import Button from "../../components/UI/buttons/Button/Button";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/AuthTypes";
import { formatDateTime } from "../../utils/dateUtils";
import { SERVER_CONFIG } from "../../config/apiConfig";

export const ProfilePage: FC = () => {
  const { user, updateUser, isLoading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();


  const { logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (authLoading || pageLoading) {
    return (
      <div className={styles.page}>
        <Header onSearch={() => {}} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <Header onSearch={() => {}} />
        <div className={styles.content}>
          <div className={styles.error}>
            <h3>User not found</h3>
            <Button
              variant="light"
              onClick={() => navigate("/login")}
              className={styles.loginButton}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
      id: user.id,
    };

    console.log("Calling updateUser with:", safeUpdate);
    updateUser(safeUpdate);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className={styles.page}>
      <Header onSearch={() => {}} />
      <div className={styles.content}>
        {isEditing ? (
          <ProfileEditCard
            user={user}
            currentImage={user.avatar}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <>
            <ProfileCard name={user.name} image={`${SERVER_CONFIG.BASE_URL}` + user.avatar}/>
            <div className={styles.wrapper}>
              <div className={styles.actions}>
                <Button className={styles.editButton} onClick={handleEditClick}>
                  Manage Account
                </Button>
                <Button
                  variant="light"
                  onClick={handleLogout}
                  className={styles.logoutButton}
                >
                  Logout
                </Button>
              </div>
              <div className={styles.registrationInfo}>
                <p className={styles.registrationText}>Joined to us:</p>
                <p>{formatDateTime(user.registrationDate)}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
