import { useState, useEffect, useCallback, type FC } from "react";
import { categoryApi } from "../../api/CategoryApi";
import { postApi } from "../../api/PostApi";
import type { Category } from "../../types/Category";
import { useAuth } from "../../hooks/useAuth";
import { Role } from "../../types/enums/Roles";
import styles from "./CategoriesManagement.module.scss";
import { AddButton } from "../UI/buttons/AddButton/AddButton";
import Button from "../UI/buttons/Button/Button";
import SectionTitle from "../UI/SectionTitle/SectionTitle";
import Modal from "../UI/Modal/Modal";
import deleteIcon from "../../assets/delete.svg";
import editIcon from "../../assets/edit.svg";

export const CategoriesManagement: FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === Role.Admin;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [postsCount, setPostsCount] = useState<number>(0);
  const [checkingPosts, setCheckingPosts] = useState(false);
  const [categoryToDeleteName, setCategoryToDeleteName] = useState<string>("");

  const loadCategories = useCallback(async (showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const data = await categoryApi.getAllCategories();
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load categories";
      setError(errorMessage);
      console.error("Error loading categories:", err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadCategories();
    }
  }, [isAdmin, loadCategories]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await categoryApi.createCategory(
        newCategoryName.trim(),
        newCategoryIcon.trim() || undefined
      );
      setNewCategoryName("");
      setNewCategoryIcon("");
      setShowAddForm(false);
      // Перезагружаем список категорий для синхронизации с сервером
      await loadCategories(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create category";
      setError(errorMessage);
      console.error("Error creating category:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setNewCategoryName(category.name);
    setShowAddForm(false);
    setError(null);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !editingCategoryId) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await categoryApi.updateCategory(
        editingCategoryId,
        newCategoryName.trim()
      );
      setNewCategoryName("");
      setEditingCategoryId(null);
      // Перезагружаем список категорий для синхронизации с сервером
      await loadCategories(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update category";
      setError(errorMessage);
      console.error("Error updating category:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setNewCategoryName("");
    setError(null);
  };

  const handleDeleteCategory = async (id: number, categoryName: string) => {
    setCategoryToDelete(id);
    setCategoryToDeleteName(categoryName);
    setCheckingPosts(true);
    setError(null);
    
    try {
      // Проверяем, есть ли посты с этой категорией
      const posts = await postApi.getPostsByCategoryId(id);
      setPostsCount(posts.length);
      setShowDeleteConfirm(true);
    } catch (err) {
      console.error("Error checking posts for category:", err);
      // Если не удалось проверить, всё равно показываем модальное окно
      setPostsCount(0);
      setShowDeleteConfirm(true);
    } finally {
      setCheckingPosts(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    // Если есть посты с этой категорией, запрещаем удаление
    if (postsCount > 0) {
      setError(`Cannot delete category "${categoryToDeleteName}". There are ${postsCount} post(s) using this category. Please reassign or delete these posts first.`);
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
      setCategoryToDeleteName("");
      setPostsCount(0);
      return;
    }

    try {
      setError(null);
      await categoryApi.deleteCategory(categoryToDelete);
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete));
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
      setCategoryToDeleteName("");
      setPostsCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete category";
      setError(errorMessage);
      console.error("Error deleting category:", err);
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
      setCategoryToDeleteName("");
      setPostsCount(0);
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
        {!showAddForm && editingCategoryId === null && (
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

      {(showAddForm || editingCategoryId !== null) && (
        <form 
          onSubmit={editingCategoryId !== null ? handleUpdateCategory : handleAddCategory} 
          className={styles.addForm}
        >
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
          <div className={styles.formActions}>
            <Button
              type="button"
              variant="light"
              onClick={editingCategoryId !== null ? handleCancelEdit : () => {
                setShowAddForm(false);
                setNewCategoryName("");
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
              {isSubmitting 
                ? (editingCategoryId !== null ? "Updating..." : "Adding...") 
                : (editingCategoryId !== null ? "Update Category" : "Add Category")
              }
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
              {editingCategoryId === category.id ? (
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={styles.editingLabel}>(Editing...)</span>
                </div>
              ) : (
                <>
                  <div className={styles.categoryInfo}>
                    <span className={styles.categoryName}>{category.name}</span>
                  </div>
                  <div className={styles.categoryActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditCategory(category)}
                      title="Edit category"
                      disabled={showAddForm || editingCategoryId !== null}
                    >
                      <img src={editIcon} alt="Edit" className={styles.editIcon} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                      title="Delete category"
                      disabled={showAddForm || editingCategoryId !== null || checkingPosts}
                    >
                      <img src={deleteIcon} alt="Delete" className={styles.deleteIcon} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setCategoryToDelete(null);
            setCategoryToDeleteName("");
            setPostsCount(0);
          }}
          title={postsCount > 0 ? "Cannot Delete Category" : "Confirm Deletion"}
        >
          {checkingPosts ? (
            <p className={styles.deleteConfirmText}>Checking posts...</p>
          ) : postsCount > 0 ? (
            <>
              <p className={styles.deleteConfirmText}>
                Cannot delete category <strong>"{categoryToDeleteName}"</strong>.
              </p>
              <p className={styles.deleteConfirmText}>
                There {postsCount === 1 ? "is" : "are"} <strong>{postsCount}</strong> post{postsCount !== 1 ? "s" : ""} using this category.
              </p>
              <p className={styles.deleteConfirmWarning}>
                Please reassign these posts to another category or delete them before deleting this category.
              </p>
            </>
          ) : (
            <p className={styles.deleteConfirmText}>
              Are you sure you want to delete category <strong>"{categoryToDeleteName}"</strong>? This action cannot be undone.
            </p>
          )}
          <div className={styles.deleteConfirmActions}>
            <Button
              type="button"
              variant="light"
              onClick={() => {
                setShowDeleteConfirm(false);
                setCategoryToDelete(null);
                setCategoryToDeleteName("");
                setPostsCount(0);
              }}
            >
              {postsCount > 0 ? "Close" : "Cancel"}
            </Button>
            {postsCount === 0 && (
              <button
                type="button"
                className={styles.deleteConfirmButton}
                onClick={confirmDelete}
              >
                Delete
              </button>
            )}
          </div>
        </Modal>
      )}
    </section>
  );
};

export default CategoriesManagement;

