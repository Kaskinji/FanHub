
import React from "react";
import styles from "./ErrorMessage.module.scss";

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onClose,
  className = ""
}) => {
  return (
    <div className={`${styles.errorMessage} ${className}`}>
      <span>{message}</span>
      <button
        className={styles.closeErrorButton}
        onClick={onClose}
        aria-label="Close error message"
      >
        ×
      </button>
    </div>
  );
};

export default ErrorMessage;