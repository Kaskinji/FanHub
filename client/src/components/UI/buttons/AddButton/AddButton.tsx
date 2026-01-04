import { type FC } from "react";
import styles from "./AddButton.module.scss";

interface AddButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const AddButton: FC<AddButtonProps> = ({ 
  text, 
  onClick, 
  className = "",
  disabled = false 
}) => {
  return (
    <button
      className={`${styles.addButton} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default AddButton;

