import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { fandomApi, type FandomReadDto, type FandomCreateDto } from "../../../api/FandomApi";
import { imageApi } from "../../../api/ImageApi";
import styles from "../AddFandomForm/AddFandomForm.module.scss";
import { getImageUrl } from "../../../utils/urlUtils";

interface FandomFormProps {
  gameId?: number;
  fandomId?: number; // If provided, form is in edit mode
  onCancel: () => void;
  onSuccess: (fandomId: number) => void;
}

export const FandomForm = ({
  gameId,
  fandomId,
  onCancel,
  onSuccess,
}: FandomFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isEditMode = !!fandomId;

  const [formData, setFormData] = useState<
    Omit<FandomCreateDto, "coverImage"> & { coverImage?: string }
  >({
    gameId: gameId || 0,
    name: "",
    description: "",
    rules: "",
  });

  useEffect(() => {
    if (isEditMode && fandomId) {
      const loadFandom = async () => {
        try {
          const data: FandomReadDto = await fandomApi.getFandomById(fandomId);
          setFormData({
            gameId: data.gameId,
            name: data.name,
            description: data.description || "",
            rules: data.rules || "",
            coverImage: data.coverImage || "",
          });

          if (data.coverImage) {
            setCoverImagePreview(data.coverImage);
          }
        } catch (err) {
          console.error("Failed to load fandom for edit:", err);
          setError("Failed to load fandom data");
        }
      };

      loadFandom();
    }
  }, [fandomId, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    setCoverImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setCoverImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFileError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Fandom name is required");
      return;
    }

    if (!isEditMode && (!formData.gameId || formData.gameId <= 0)) {
      setError("Game ID is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let coverImageName: string | undefined = undefined;
      if (coverImageFile) {
        try {
          coverImageName = await imageApi.uploadImage(coverImageFile);
        } catch (uploadError) {
          setError("Failed to upload cover image. Please try again.");
          console.error("Error uploading cover image:", uploadError);
          return;
        }
      }

      const fandomDto: FandomCreateDto = {
        gameId: formData.gameId,
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        rules: formData.rules?.trim() || "",
        coverImage: coverImageName || (isEditMode ? undefined : ""),
      };

      if (isEditMode && fandomId) {
        await fandomApi.updateFandom(fandomId, fandomDto);
        onSuccess(fandomId);
      } else {
        const newFandomId = await fandomApi.createFandom(fandomDto);
        onSuccess(newFandomId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save fandom";
      setError(errorMessage);
      console.error("Error saving fandom:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !fandomId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this fandom? This action cannot be undone."
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    try {
      await fandomApi.deleteFandom(fandomId);
      navigate(`/allfandoms`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete fandom";
      setError(errorMessage);
      console.error("Error deleting fandom:", err);
    } finally {
      setLoading(false);
    }
  };

  const formTitle = isEditMode ? "Manage Fandom" : "Create New Fandom";
  const submitButtonText = isEditMode ? "Save Changes" : "Create Fandom";
  const submitLoadingText = isEditMode ? "Saving..." : "Creating...";

  return (
    <div className={styles.formContainer}>
      <div className={styles.formInner}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={loading}
        >
          X
        </button>

        <h3 className={styles.formTitle}>{formTitle}</h3>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Fandom Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter fandom name"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your fandom"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="rules">Rules</label>
            <textarea
              id="rules"
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              placeholder="Community rules"
              rows={4}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="coverImage">Cover Image</label>

            {coverImagePreview && (
              <div className={styles.imagePreviewContainer}>
                <img
                  src={
                    coverImagePreview === formData.coverImage
                      ? `${getImageUrl(coverImagePreview)}`
                      : coverImagePreview
                  }
                  alt="Cover preview"
                  className={styles.imagePreview}
                />
                <button
                  type="button"
                  onClick={handleRemoveCoverImage}
                  className={styles.removeImageButton}
                  disabled={loading}
                >
                  Remove Image
                </button>
              </div>
            )}

            <div className={styles.fileUploadContainer}>
              <label htmlFor="coverImage" className={styles.fileInputLabel}>
                <input
                  type="file"
                  id="coverImage"
                  ref={fileInputRef}
                  onChange={handleCoverImageChange}
                  accept="image/*"
                  className={styles.fileInput}
                  disabled={loading}
                />
                <span className={styles.fileInputButton}>Choose File</span>
              </label>

              <span className={styles.fileHint}>
                Max size: 5MB (JPEG, PNG, GIF, WebP)
              </span>
            </div>

            {fileError && <div className={styles.fileError}>{fileError}</div>}
          </div>

          <div className={styles.formActions}>
            {isEditMode && (
              <button
                type="button"
                className={styles.deleteButton}
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Fandom
              </button>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? submitLoadingText : submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FandomForm;
