// components/AddFandomForm/AddFandomForm.tsx
import { useState } from "react";
import { fandomApi, type FandomCreateDto } from "../../../api/FandomApi";
import styles from "./AddFandomForm.module.scss";

interface AddFandomFormProps {
  gameId?: number;
  onCancel: () => void;
  onSuccess: (fandomId: number) => void;
}

export const AddFandomForm = ({ gameId, onCancel, onSuccess }: AddFandomFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FandomCreateDto>({
    gameId: gameId || 0,
    name: "",
    description: "",
    coverImage: "",
    rules: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Fandom name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const fandomId = await fandomApi.createFandom(formData);
      onSuccess(fandomId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create fandom");
      console.error("Error creating fandom:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Create New Fandom</h3>
      
      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}
      
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
          <label htmlFor="coverImage">Cover Image URL</label>
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
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
        
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Fandom"}
          </button>
        </div>
      </form>
    </div>
  );
};