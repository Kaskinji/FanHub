import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { eventApi, type EventReadDto, type EventCreateDto, type EventUpdateDto } from "../../../api/EventApi";
import { imageApi } from "../../../api/ImageApi";
import styles from "./EventForm.module.scss";
import { getImageUrl } from "../../../utils/urlUtils";
import Modal from "../../../components/UI/Modal/Modal";

interface EventFormProps {
  fandomId: number;
  eventId?: number; // If provided, form is in edit mode
  onCancel: () => void;
  onSuccess: () => void;
}

export const EventForm = ({
  fandomId,
  eventId,
  onCancel,
  onSuccess,
}: EventFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageRemoved, setImageRemoved] = useState(false);
  const [originalImageName, setOriginalImageName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!eventId;

  const [formData, setFormData] = useState<
    Omit<EventCreateDto, "imageUrl"> & { imageUrl?: string | null }
  >({
    fandomId,
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (isEditMode && eventId) {
      const loadEvent = async () => {
        try {
          const data: EventReadDto = await eventApi.getEventById(eventId);
          setFormData({
            fandomId: data.fandomId,
            title: data.title,
            description: data.description || "",
            startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : "",
            endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : "",
            imageUrl: data.imageUrl || null,
          });

          if (data.imageUrl) {
            setImagePreview(data.imageUrl);
            setOriginalImageName(data.imageUrl);
          } else {
            setOriginalImageName(null);
          }
          setImageRemoved(false);
        } catch (err) {
          console.error("Failed to load event for edit:", err);
          setError("Failed to load event data");
        }
      };

      loadEvent();
    }
  }, [eventId, isEditMode]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onCancel, loading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    setImageFile(file);
    setImageRemoved(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFileError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Event title is required");
      return;
    }

    if (!formData.startDate) {
      setError("Start date is required");
      return;
    }

    if (!formData.endDate) {
      setError("End date is required");
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (endDate <= startDate) {
      setError("End date must be after start date");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let imageUrl: string | null = null;
      
      // Если изображение было удалено, удаляем его с сервера
      if (imageRemoved && originalImageName) {
        try {
          await imageApi.deleteImage(originalImageName);
        } catch (deleteError) {
          console.warn("Could not delete old image:", deleteError);
          // Не прерываем процесс, если удаление не удалось
        }
        imageUrl = null;
      } else if (imageFile) {
        // Если загружается новое изображение, удаляем старое (если есть)
        if (originalImageName) {
          try {
            await imageApi.deleteImage(originalImageName);
          } catch (deleteError) {
            console.warn("Could not delete old image:", deleteError);
            // Не прерываем процесс, если удаление не удалось
          }
        }
        
        try {
          const uploadedImageName = await imageApi.uploadImage(imageFile);
          imageUrl = uploadedImageName;
        } catch (uploadError) {
          setError("Failed to upload image. Please try again.");
          console.error("Error uploading image:", uploadError);
          return;
        }
      } else if (isEditMode && formData.imageUrl && !imageRemoved) {
        imageUrl = formData.imageUrl;
      }

      if (isEditMode && eventId) {
        const eventDto: EventUpdateDto = {
          title: formData.title.trim(),
          description: formData.description?.trim() || "",
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          imageUrl: imageUrl,
        };
        await eventApi.updateEvent(eventId, eventDto);
        onSuccess();
      } else {
        const eventDto: EventCreateDto = {
          fandomId: formData.fandomId,
          title: formData.title.trim(),
          description: formData.description?.trim() || "",
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          imageUrl: imageUrl || null,
        };
        await eventApi.createEvent(eventDto);
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save event";
      setError(errorMessage);
      console.error("Error saving event:", err);
    } finally {
      setLoading(false);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (!isEditMode || !eventId) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!isEditMode || !eventId) return;

    setLoading(true);
    setError(null);
    try {
      await eventApi.deleteEvent(eventId);
      setShowDeleteConfirm(false);
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete event";
      setError(errorMessage);
      console.error("Error deleting event:", err);
    } finally {
      setLoading(false);
    }
  };

  const formTitle = isEditMode ? "Manage Event" : "Create New Event";
  const submitButtonText = isEditMode ? "Save Changes" : "Create Event";
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
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
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
              placeholder="Describe your event"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="startDate">Start Date & Time *</label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date & Time *</label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imageUrl">Event Image</label>

            {imagePreview && (
              <div className={styles.imagePreviewContainer}>
                <img
                  src={
                    imagePreview === formData.imageUrl
                      ? `${getImageUrl(imagePreview)}`
                      : imagePreview
                  }
                  alt="Event preview"
                  className={styles.imagePreview}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className={styles.removeImageButton}
                  disabled={loading}
                >
                  Remove Image
                </button>
              </div>
            )}

            <div className={styles.fileUploadContainer}>
              <label htmlFor="imageUrl" className={styles.fileInputLabel}>
                <input
                  type="file"
                  id="imageUrl"
                  ref={fileInputRef}
                  onChange={handleImageChange}
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
                Delete Event
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

        {showDeleteConfirm && (
          <Modal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            title="Confirm Deletion"
          >
            <p className={styles.deleteConfirmText}>Are you sure you want to delete this event? This action cannot be undone.</p>
            <div className={styles.deleteConfirmActions}>
              <button
                type="button"
                className={styles.submitButton}
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={confirmDelete}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
};

export default EventForm;

