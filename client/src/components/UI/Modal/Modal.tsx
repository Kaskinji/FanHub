// components/UI/Modal/Modal.tsx
import type { FC, ReactNode, MouseEvent } from "react";
import { useEffect } from "react";
import styles from "./Modal.module.scss"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

const Modal: FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className 
}) => {
  // Закрытие по ESC и блокировка скролла wrapper
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      
      // Блокируем скролл на wrapper
      const wrapper = document.getElementById("app-wrapper");
      if (wrapper) {
        wrapper.style.overflow = "hidden";
      }
      
      return () => {
        document.removeEventListener("keydown", handleEscape);
        
        // Восстанавливаем скролл wrapper
        if (wrapper) {
          wrapper.style.overflow = "auto";
        }
      };
    }
  }, [isOpen, onClose]);

  // Обработка клика по оверлею
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={handleOverlayClick}
    >
      <div className={`${styles.modal} ${className || ''}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;