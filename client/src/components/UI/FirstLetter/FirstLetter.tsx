import React, { type FC } from 'react';
import styles from './FirstLetter.module.scss';

interface FirstLetterProps {
  text: string;
  fontSize?: string | number;
  className?: string;
}

export const FirstLetter: FC<FirstLetterProps> = ({ 
  text, 
  fontSize,
  className = '' 
}) => {
  const firstLetter = text.charAt(0).toUpperCase();
  
  const style: React.CSSProperties = {};
  if (fontSize) {
    style.fontSize = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;
  }

  return (
    <span 
      className={`${styles.firstLetter} ${className}`}
      style={style}
    >
      {firstLetter}
    </span>
  );
};

export default FirstLetter;

