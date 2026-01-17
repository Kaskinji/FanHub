
import type { ReactNode } from "react";
import styles from "./FormGroup.module.scss";

interface FormGroupProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  error?: string;
  className?: string;
}

export const FormGroup = ({ 
  label, 
  htmlFor, 
  children, 
  error, 
  className = "" 
}: FormGroupProps) => {
  return (
    <div className={`${styles.formGroup} ${className}`}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {children}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};