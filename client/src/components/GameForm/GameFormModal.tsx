// components/GameForm/GameFormModal.tsx
import { useState, type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../UI/Input/Input";
import Modal from "../UI/Modal/Modal";
import Button from "../UI/buttons/Button/Button"
import styles from "./GameFormModal.module.scss";
import type { GameCreateDto } from "../../api/GameApi";

interface GameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GameCreateDto) => Promise<void>;
}

interface FormData {
  title: string;
  description: string;
  releaseDate: string;
  developer: string;
  publisher: string;
  coverImage: string;
  genre: string;
}

const GameFormModal: FC<GameFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      releaseDate: '',
      developer: '',
      publisher: '',
      coverImage: '',
      genre: 'Action',
    }
  });

  // Сброс формы при открытии/закрытии
  useEffect(() => {
    if (!isOpen) {
      reset();
      setError(null);
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await onSubmit({
        title: data.title,
        description: data.description,
        releaseDate: data.releaseDate,
        developer: data.developer,
        publisher: data.publisher,
        coverImage: data.coverImage || '/images/default-game.jpg',
        genre: data.genre,
      });
      
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create game';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const genres = [
    'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 
    'Sports', 'Puzzle', 'Idle', 'Arcade', 'Racing', 'Fighting',
    'Shooter', 'Survival', 'Horror', 'Platformer', 'MMO'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Game"
      className={styles.modal}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Game Title *
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter game title"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 2,
                  message: "Title must be at least 2 characters"
                }
              })}
              isError={!!errors.title}
            />
            {errors.title && (
              <span className={styles.error}>{errors.title.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="genre" className={styles.label}>
              Genre *
            </label>
            <select
              id="genre"
              className={`${styles.select} ${errors.genre ? styles.error : ''}`}
              {...register("genre", { required: "Genre is required" })}
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            {errors.genre && (
              <span className={styles.error}>{errors.genre.message}</span>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description *
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            placeholder="Enter game description"
            rows={4}
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters"
              }
            })}
          />
          {errors.description && (
            <span className={styles.error}>{errors.description.message}</span>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="developer" className={styles.label}>
              Developer *
            </label>
            <Input
              id="developer"
              type="text"
              placeholder="Enter developer name"
              {...register("developer", {
                required: "Developer is required"
              })}
              isError={!!errors.developer}
            />
            {errors.developer && (
              <span className={styles.error}>{errors.developer.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="publisher" className={styles.label}>
              Publisher *
            </label>
            <Input
              id="publisher"
              type="text"
              placeholder="Enter publisher name"
              {...register("publisher", {
                required: "Publisher is required"
              })}
              isError={!!errors.publisher}
            />
            {errors.publisher && (
              <span className={styles.error}>{errors.publisher.message}</span>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="releaseDate" className={styles.label}>
              Release Date *
            </label>
            <Input
              id="releaseDate"
              type="date"
              {...register("releaseDate", {
                required: "Release date is required"
              })}
              isError={!!errors.releaseDate}
            />
            {errors.releaseDate && (
              <span className={styles.error}>{errors.releaseDate.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="coverImage" className={styles.label}>
              Cover Image URL
            </label>
            <Input
              id="coverImage"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register("coverImage")}
              isError={!!errors.coverImage}
            />
            <span className={styles.hint}>
              Optional. Default image will be used if empty.
            </span>
          </div>
        </div>

        <div className={styles.formActions}>
          <Button
            type="button"
            variant="light"
            onClick={onClose}
            disabled={isSubmitting}
            className={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Creating..." : "Create Game"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GameFormModal;