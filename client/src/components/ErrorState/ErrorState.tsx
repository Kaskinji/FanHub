
import React from "react";
import styles from "./ErrorState.module.scss";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry,
  retryText = "Try Again",
  className = ""
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={`${styles.errorState} ${className}`}>
      <p className={styles.errorText}>{error}</p>
      <button
        className={styles.retryButton}
        onClick={handleRetry}
      >
        {retryText}
      </button>
    </div>
  );
};

export default ErrorState;