import { useState, useRef, useEffect } from "react";
import styles from "./CustomSelect.module.scss";
import arrowBottomIcon from "../../../assets/arrow-bottom.svg";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  label,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`${styles.selectWrapper} ${className || ""}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.customSelect} ref={selectRef}>
        <button
          type="button"
          className={`${styles.selectButton} ${isOpen ? styles.open : ""}`}
          onClick={handleToggle}
        >
          <span>{selectedOption?.label || "Select..."}</span>
          <img
            src={arrowBottomIcon}
            alt="arrow"
            className={`${styles.arrowIcon} ${isOpen ? styles.arrowUp : ""}`}
          />
        </button>
        {isOpen && (
          <div className={styles.optionsContainer}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.option} ${value === option.value ? styles.selected : ""}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
