import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { gameApi, type GameReadDto, type GameCreateDto, type GameUpdateDto } from "../../../api/GameApi";
import { imageApi } from "../../../api/ImageApi";
import styles from "./GameForm.module.scss";
import { getImageUrl } from "../../../utils/urlUtils";
import Modal from "../../../components/UI/Modal/Modal";

interface GameFormProps {
  gameId?: number; // Если передан, то режим редактирования
  onCancel: () => void;
  onSuccess: (gameId: number) => void;
}

export const GameForm = ({
  gameId,
  onCancel,
  onSuccess,
}: GameFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isEditMode = !!gameId;

  const genres = [
    "Action", "Adventure", "RPG", "Strategy", "Simulation", 
    "Sports", "Puzzle", "Idle", "Arcade", "Racing", "Fighting",
    "Shooter", "Survival", "Horror", "Platformer", "MMO",
    "Action RPG", "Action-Adventure", "CRPG", "Sandbox", 
    "MOBA", "FPS", "Metroidvania", "Farming Sim", "Puzzle-Platformer"
  ];

  const [formData, setFormData] = useState<
    Omit<GameCreateDto, "coverImage"> & { coverImage?: string }
  >({
    title: "",
    description: "",
    releaseDate: new Date().toISOString().split('T')[0], // Текущая дата в формате YYYY-MM-DD
    developer: "",
    publisher: "",
    genre: "Action",
  });

  useEffect(() => {
    if (isEditMode && gameId) {
      const loadGame = async () => {
        try {
          const data: GameReadDto = await gameApi.getGameById(gameId);
          setFormData({
            title: data.title,
            description: data.description,
            releaseDate: data.releaseDate.split('T')[0], // Конвертируем в формат даты для input
            developer: data.developer,
            publisher: data.publisher,
            genre: data.genre,
            coverImage: data.coverImage || "",
          });

          if (data.coverImage) {
            setCoverImagePreview(data.coverImage);
          }
        } catch (err) {
          console.error("Failed to load game for edit:", err);
          setError("Failed to load game data");
        }
      };

      loadGame();
    }
  }, [gameId, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

    if (!formData.title.trim()) {
      setError("Game title is required");
      return;
    }

    if (!formData.releaseDate) {
      setError("Release date is required");
      return;
    }

    if (!formData.genre) {
      setError("Genre is required");
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

      // Форматируем дату для API
      const formattedDate = new Date(formData.releaseDate).toISOString();

      if (isEditMode && gameId) {
        const gameDto: GameUpdateDto = {
          title: formData.title.trim(),
          description: formData.description?.trim() || "",
          releaseDate: formattedDate,
          developer: formData.developer?.trim() || "",
          publisher: formData.publisher?.trim() || "",
          coverImage: coverImageName || formData.coverImage || "",
          genre: formData.genre,
        };
        
        await gameApi.updateGame(gameId, gameDto);
        onSuccess(gameId);
      } else {
        const gameDto: GameCreateDto = {
          title: formData.title.trim(),
          description: formData.description?.trim() || "",
          releaseDate: formattedDate,
          developer: formData.developer?.trim() || "",
          publisher: formData.publisher?.trim() || "",
          coverImage: coverImageName || "/images/default-game.jpg",
          genre: formData.genre,
        };
        
        const newGameId = await gameApi.createGame(gameDto);
        onSuccess(newGameId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save game";
      setError(errorMessage);
      console.error("Error saving game:", err);
    } finally {
      setLoading(false);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (!isEditMode || !gameId) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!isEditMode || !gameId) return;

    setLoading(true);
    setError(null);
    try {
      await gameApi.deleteGame(gameId);
      setShowDeleteConfirm(false);
      navigate(`/games`); // Перенаправляем на список игр
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete game";
      setError(errorMessage);
      console.error("Error deleting game:", err);
    } finally {
      setLoading(false);
    }
  };

  const formTitle = isEditMode ? "Edit Game" : "Create New Game";
  const submitButtonText = isEditMode ? "Save Changes" : "Create Game";
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
            <label htmlFor="title">Game Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter game title"
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
              placeholder="Describe the game"
              rows={4}
              disabled={loading}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="developer">Developer</label>
              <input
                type="text"
                id="developer"
                name="developer"
                value={formData.developer}
                onChange={handleChange}
                placeholder="Game developer"
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="publisher">Publisher</label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Game publisher"
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="releaseDate">Release Date *</label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="genre">Genre *</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                disabled={loading}
                className={styles.select}
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
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
                Delete Game
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
            <p className={styles.deleteConfirmText}>
              Are you sure you want to delete this game? 
              All associated fandoms and content will also be deleted. 
              This action cannot be undone.
            </p>
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

export default GameForm;