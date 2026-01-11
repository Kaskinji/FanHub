import { useState, useEffect, type FC } from "react";
import { categoryApi } from "../../api/CategoryApi";
import type { Category } from "../../types/Category";
import { useAuth } from "../../hooks/useAuth";
import { Role } from "../../types/enums/Roles";
import styles from "./CategoriesManagement.module.scss";
import { AddButton } from "../UI/buttons/AddButton/AddButton";
import Button from "../UI/buttons/Button/Button";
import SectionTitle from "../UI/SectionTitle/SectionTitle";
import deleteIcon from "../../assets/delete.svg";

export const CategoriesManagement: FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === Role.Admin;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadCategories();
    }
  }, [isAdmin]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryApi.getAllCategories();
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load categories";
      setError(errorMessage);
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const category = await categoryApi.createCategory(
        newCategoryName.trim(),
        newCategoryIcon.trim() || undefined
      );
      setCategories([...categories, category]);
      setNewCategoryName("");
      setNewCategoryIcon("");
      setShowAddForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create category";
      setError(errorMessage);
      console.error("Error creating category:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      setError(null);
      await categoryApi.deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete category";
      setError(errorMessage);
      console.error("Error deleting category:", err);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <section className={styles.categoriesSection}>
        <SectionTitle title="Categories Management" />
        <div className={styles.loadingState}>
          <p>Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.categoriesSection}>
      <div className={styles.sectionHeader}>
        <SectionTitle title="Categories Management" />
        {!showAddForm && (
          <AddButton
            text="Add Category"
            onClick={() => setShowAddForm(true)}
          />
        )}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddCategory} className={styles.addForm}>
          <div className={styles.formGroup}>
            <label htmlFor="categoryName">Category Name *</label>
            <input
              type="text"
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="categoryIcon">Icon (optional)</label>
            <input
              type="text"
              id="categoryIcon"
              value={newCategoryIcon}
              onChange={(e) => setNewCategoryIcon(e.target.value)}
              placeholder="Icon URL or emoji"
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formActions}>
            <Button
              type="button"
              variant="light"
              onClick={() => {
                setShowAddForm(false);
                setNewCategoryName("");
                setNewCategoryIcon("");
                setError(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="light"
              disabled={!newCategoryName.trim() || isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </form>
      )}

      {categories.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No categories found</p>
        </div>
      ) : (
        <div className={styles.categoriesList}>
          {categories.map((category) => (
            <div key={category.id} className={styles.categoryItem}>
              <div className={styles.categoryInfo}>
                {category.icon && (
                  <span className={styles.categoryIcon}>{category.icon}</span>
                )}
                <span className={styles.categoryName}>{category.name}</span>
              </div>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteCategory(category.id)}
                title="Delete category"
              >
                <img src={deleteIcon} alt="Delete" className={styles.deleteIcon} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoriesManagement;

