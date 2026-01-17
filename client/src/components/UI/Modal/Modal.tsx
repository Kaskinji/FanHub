
import type { FC, ReactNode, MouseEvent } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  hideOverlay?: boolean; 
}

const Modal: FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  hideOverlay = false
}) => {
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      
      
      const wrapper = document.getElementById("app-wrapper");
      if (wrapper) {
        wrapper.style.overflow = "hidden";
      }
      
      return () => {
        document.removeEventListener("keydown", handleEscape);
        
        
        if (wrapper) {
          wrapper.style.overflow = "auto";
        }
      };
    }
  }, [isOpen, onClose]);

  
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  
  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className={`${styles.modalOverlay} ${hideOverlay ? styles.noOverlay : ''}`} 
      onClick={handleOverlayClick}
    >
      <div 
        className={`${styles.modal} ${hideOverlay ? styles.modalOverlayContent : ''} ${className || ''}`}
        onClick={handleModalClick}
      >
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

  
  return createPortal(modalContent, document.body);
};

export default Modal;