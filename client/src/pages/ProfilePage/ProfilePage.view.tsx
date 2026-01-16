import type { FC } from "react";
import Header from "../../components/Header/Header";
import { ProfileCard } from "./ProfileCard/ProfileCard";
import { ProfileEditCard } from "./ProfileEditCard/ProfileEditCard";
import Button from "../../components/UI/buttons/Button/Button";
import type { User } from "../../types/AuthTypes";
import { formatDateTime } from "../../utils/dateUtils";
import { SERVER_CONFIG } from "../../config/apiConfig";
import logoutIcon from "../../assets/logout.svg";
import styles from "./ProfilePage.module.scss";

type ProfilePageViewProps = {
  user: User | null;
  authLoading: boolean;
  pageLoading: boolean;
  isEditing: boolean;
  isAdmin: boolean;
  handleEditClick: () => void;
  handleLogout: () => Promise<void>;
  handleSave: (updatedUserData: Partial<User>) => void;
  handleCancel: () => void;
  navigate: (path: string) => void;
}

export const ProfilePageView: FC<ProfilePageViewProps> = ({
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
}) => {
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
                {isAdmin && (
                  <Button
                    variant="light"
                    onClick={() => navigate("/fandom-service-management")}
                    className={styles.adminButton}
                  >
                    Service Management
                  </Button>
                )}
                <Button
                  variant="light"
                  onClick={handleLogout}
                  className={styles.logoutButton}
                >
                  <img src={logoutIcon} alt="Logout" className={styles.logoutIcon}/>
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

