import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { postApi, type PostReadDto, type PostCreateDto, type PostUpdateDto } from "../../../api/PostApi";
import { imageApi } from "../../../api/ImageApi";
import { categoryApi } from "../../../api/CategoryApi";
import type { Category } from "../../../types/Category";
import styles from "./PostForm.module.scss";
import { getImageUrl } from "../../../utils/urlUtils";
import Modal from "../../../components/UI/Modal/Modal";

interface PostFormProps {
  fandomId: number;
  postId?: number;
  onCancel: () => void;
  onSuccess: (postId: number) => void;
}

export const PostForm = ({
  fandomId,
  postId,
  onCancel,
  onSuccess,
}: PostFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!postId;

  const [formData, setFormData] = useState<
    Omit<PostCreateDto, "mediaContent"> & { image?: string }
  >({
    fandomId,
    title: "",
    content: "",
    categoryId: 1, // Дефолтная категория, будет обновлена после загрузки
    image: undefined,
  });

  // Загрузка категорий при открытии формы
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await categoryApi.getAllCategories();
        setCategories(categoriesData);
        
        // Если категории загружены и formData.categoryId еще не установлен корректно, 
        // устанавливаем первую доступную категорию
        if (categoriesData.length > 0 && !isEditMode) {
          setFormData(prev => ({
            ...prev,
            categoryId: categoriesData[0].id,
          }));
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        // Не блокируем форму, если категории не загрузились
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode && postId) {
      const loadPost = async () => {
        try {
          const data: PostReadDto = await postApi.getPostById(postId);
          
          const currentUserId = Number(localStorage.getItem('user_id'));
          const isAuthor = currentUserId && data.userId === currentUserId;
          
          if (!isAuthor) {
            setError("You don't have permission to edit this post");
            return;
          }
          
          setFormData({
            fandomId: data.fandomId,
            title: data.title || "",
            content: data.content || "",
            categoryId: data.categoryId,
            image: data.mediaContent || undefined,
          });

          if (data.mediaContent) {
            setImagePreview(data.mediaContent);
          }
        } catch (err) {
          setError("Failed to load post data");
        }
      };

      loadPost();
    }
  }, [postId, isEditMode]);

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
    setFormData((prev) => ({ ...prev, image: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFileError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Post title is required");
      return;
    }

    if (!formData.content.trim()) {
      setError("Post content is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let imageName: string | undefined = undefined;
      if (imageFile) {
        try {
          imageName = await imageApi.uploadImage(imageFile);
        } catch (uploadError) {
          setError("Failed to upload image. Please try again.");
          console.error("Error uploading image:", uploadError);
          return;
        }
      }

      if (isEditMode && postId) {
        const postDto = await postApi.getPostById(postId);
        const currentUserId = Number(localStorage.getItem('user_id'));
        const isAuthor = currentUserId && postDto.userId === currentUserId;
        
        if (!isAuthor) {
          setError("You don't have permission to edit this post");
          return;
        }
        
        // Определяем значение mediaContent:
        // 1. Если загружено новое изображение - используем его
        // 2. Если изображение было удалено (imagePreview пустое) - отправляем пустую строку
        // 3. Если старое изображение существует и не было удалено - используем его
        let mediaContent: string | undefined;
        if (imageName) {
          // Новое изображение загружено
          mediaContent = imageName;
        } else if (!imagePreview) {
          // Изображение было удалено или его не было
          // Если было старое изображение, отправляем пустую строку для удаления
          // Если не было, отправляем undefined
          mediaContent = formData.image ? "" : undefined;
        } else if (formData.image && !imageFile) {
          // Старое изображение остается (есть preview и нет нового файла)
          mediaContent = formData.image;
        } else {
          // Нет изображения
          mediaContent = undefined;
        }

        const updateDto: PostUpdateDto = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          categoryId: formData.categoryId,
          mediaContent: mediaContent,
        };
        await postApi.updatePost(postId, updateDto);
        onSuccess(postId);
      } else {
        const postDto: PostCreateDto = {
          fandomId: formData.fandomId,
          title: formData.title.trim(),
          content: formData.content.trim(),
          categoryId: formData.categoryId, 
          mediaContent: imageName || undefined, 
        };
        const newPostId = await postApi.createPost(postDto);
        onSuccess(newPostId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save post";
      setError(errorMessage);
      console.error("Error saving post:", err);
    } finally {
      setLoading(false);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (!isEditMode || !postId) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!isEditMode || !postId) return;

    setLoading(true);
    setError(null);
    try {
      const postDto = await postApi.getPostById(postId);
      const currentUserId = Number(localStorage.getItem('user_id'));
      const isAuthor = currentUserId && postDto.userId === currentUserId;
      
      if (!isAuthor) {
        setError("You don't have permission to delete this post");
        return;
      }
      
      await postApi.deletePost(postId);
      setShowDeleteConfirm(false);
      onSuccess(postId);
      onCancel();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete post";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formTitle = isEditMode ? "Edit Post" : "Create New Post";
  const submitButtonText = isEditMode ? "Save Changes" : "Create Post";
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
            <label htmlFor="title">Post Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categoryId">Category *</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  categoryId: parseInt(e.target.value, 10),
                }));
                if (error) setError(null);
              }}
              className={styles.select}
              required
              disabled={loading || loadingCategories}
            >
              {loadingCategories ? (
                <option value="">Loading categories...</option>
              ) : categories.length === 0 ? (
                <option value="">No categories available</option>
              ) : (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content"
              rows={8}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Post Image (optional)</label>

            {imagePreview && (
              <div className={styles.imagePreviewContainer}>
                <img
                  src={
                    imagePreview === formData.image
                      ? `${getImageUrl(imagePreview)}`
                      : imagePreview
                  }
                  alt="Image preview"
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
              <label htmlFor="image" className={styles.fileInputLabel}>
                <input
                  type="file"
                  id="image"
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
                Delete Post
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
              Are you sure you want to delete this post? This action cannot be undone.
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

export default PostForm;
