import { useState, useRef, type ChangeEvent, useEffect } from "react";
import styles from "./ProfileEditCard.module.scss";
import { userApi } from "../../../api/UserApi";
import { imageApi } from "../../../api/ImageApi";
import type { User } from "../../../types/AuthTypes";
import { Avatar } from "../../../components/UI/Avatar/Avatar";
import Input from "../../../components/UI/Input/Input";
import { FormGroup } from "../../../components/UI/FormGroup/FormGroup";
import { SERVER_CONFIG } from "../../../config/apiConfig";

type ProfileEditCardProps = {
  user: User;
  currentImage: string | undefined;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

export const ProfileEditCard = ({
  user,
  currentImage,
  onSave,
  onCancel,
}: ProfileEditCardProps) => {
  const [formData, setFormData] = useState({
    username: user.name || "",
    login: user.login || "",
    password: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentImage && !avatarPreview) {
      console.log("Initial currentImage:", currentImage);
      const processedImage = processImageForAvatar(currentImage);
      setAvatarPreview(processedImage);
    }
  }, [currentImage, avatarPreview]);

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    form: "",
  });

  const processImageForAvatar = (
    imageUrl: string | undefined
  ): string | undefined => {
    if (!imageUrl) {
      return undefined;
    }
    if (imageUrl.startsWith("data:")) {
      return imageUrl;
    }

    return `${SERVER_CONFIG.BASE_URL}${imageUrl}`;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    
    
    if (errors.form) {
      setErrors(prev => ({ ...prev, form: "" }));
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null); 
    
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Please select an image file (JPEG, PNG, GIF, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("Image is too large. Maximum size is 5MB");
      return;
    }

    setAvatar(file);
    setShouldRemoveAvatar(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      console.log(
        "New avatar preview (data URL):",
        dataUrl.substring(0, 50) + "..."
      );
      setAvatarPreview(dataUrl);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview(undefined);
    setShouldRemoveAvatar(true);
    setFileError(null); 
  };

  const handleRestoreAvatar = () => {
    setShouldRemoveAvatar(false);
    if (currentImage) {
      const processedImage = processImageForAvatar(currentImage);
      setAvatarPreview(processedImage);
    }
    setFileError(null);
  };

  const extractFileName = (
    imageUrl: string | undefined
  ): string | undefined => {
    if (!imageUrl) return undefined;

    const parts = imageUrl.split("/");
    const fileName = parts[parts.length - 1];

    return fileName.split("?")[0];
  };

  const getCurrentAvatarName = (): string | undefined => {
    if (!user.avatar) return undefined;

    if (!user.avatar.includes("/")) {
      return user.avatar;
    }

    return extractFileName(user.avatar);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, form: "" }));

    let hasError = false;
    const newErrors = { ...errors };

    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      hasError = true;
    }

    
    if (formData.login && formData.login.length < 3) {
      newErrors.form = "Login must be at least 3 characters";
      hasError = true;
    }

    
    if (formData.username && formData.username.length < 2) {
      newErrors.form = "Username must be at least 2 characters";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    try {
      setIsLoading(true);

      let avatarName: string | undefined = getCurrentAvatarName();

      if (shouldRemoveAvatar && avatarName) {
        try {
          await imageApi.deleteImage(avatarName);
        } catch (error) {
          console.warn("Could not delete old avatar:", error);
          setErrors(prev => ({ 
            ...prev, 
            form: "Failed to delete old avatar. Please try again." 
          }));
        }
        avatarName = undefined;
      }

      if (avatar && !shouldRemoveAvatar) {
        if (avatarName) {
          try {
            await imageApi.deleteImage(avatarName);
          } catch (error) {
            console.warn("Could not delete old avatar:", error);
          }
        }

        avatarName = await imageApi.uploadImage(avatar);
      }

      const filteredData: any = {};

      if (formData.username && formData.username !== user.name) {
        filteredData.username = formData.username;
      }

      if (formData.login && formData.login !== user.login) {
        filteredData.login = formData.login;
      }

      if (formData.password) {
        filteredData.password = formData.password;
      }

      if (shouldRemoveAvatar) {
        filteredData.avatar = null;
      } else if (avatar) {
        filteredData.avatar = avatarName;
      } else {
        filteredData.avatar = user.avatar;
      }

      console.log("Sending update data:", filteredData);

      await userApi.updateUser(Number.parseInt(user.id), filteredData);

      const userData = await userApi.getCurrentUser();
      if (!userData) {
        throw new Error("Can't get data from user api during profile edit");
      }

      const updatedUser: User = {
        id: userData.id.toString(),
        login: userData.login,
        name: userData.username,
        role: userData.role,
        registrationDate: userData.registrationDate,
        avatar: userData.avatar,
      };

      onSave(updatedUser);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to update profile. Please try again.";
      setErrors(prev => ({ ...prev, form: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  const getAvatarPreview = () => {
    console.log("getAvatarPreview called:");
    console.log("shouldRemoveAvatar:", shouldRemoveAvatar);
    console.log("avatarPreview:", avatarPreview?.substring(0, 50) + "...");

    if (shouldRemoveAvatar) {
      return undefined;
    }

    return avatarPreview;
  };

  return (
    <div className={styles.editCard}>
      <h2 className={styles.title}>Manage Your Account</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {}
        {errors.form && (
          <div className={styles.formError}>
            {errors.form}
          </div>
        )}

        <div className={styles.avatarSection}>
          <div
            className={styles.avatarContainer}
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar src={getAvatarPreview()} size={"xlarge"} alt={user.name} />

            <div className={styles.avatarOverlay}>
              <span>Change Photo</span>
            </div>
          </div>

          {fileError && (
            <div className={styles.fileError}>
              {fileError}
            </div>
          )}

          <div className={styles.avatarButtons}>
            {(currentImage || avatarPreview) && !shouldRemoveAvatar && (
              <button
                type="button"
                className={styles.removeAvatarButton}
                onClick={handleRemoveAvatar}
              >
                Remove Photo
              </button>
            )}

            {shouldRemoveAvatar && (
              <button
                type="button"
                className={styles.undoButton}
                onClick={handleRestoreAvatar}
              >
                Undo
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        <FormGroup label="Username" htmlFor="username">
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Enter your display name"
            isError={!!errors.form && !formData.username}
          />
        </FormGroup>

        <FormGroup label="Login" htmlFor="login">
          <Input
            type="text"
            id="login"
            name="login"
            value={formData.login}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Enter your login"
            isError={!!errors.form && !formData.login}
          />
        </FormGroup>

        <FormGroup
          label="New Password"
          htmlFor="password"
          error={errors.password}
        >
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Enter new password (optional)"
            isError={!!errors.password}
          />
        </FormGroup>

        <FormGroup
          label="Confirm Password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword}
        >
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Confirm new password"
            disabled={!formData.password}
            isError={!!errors.confirmPassword}
          />
        </FormGroup>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};