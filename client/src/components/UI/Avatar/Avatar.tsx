import { type FC, useState, useMemo } from 'react';
import styles from './Avatar.module.scss';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | number; // Можно передать число
  className?: string;
  onClick?: () => void;
}

export const Avatar: FC<AvatarProps> = ({
  src,
  alt,
  size = 'medium',
  className = '',
  onClick
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Вычисляем размеры если передан number
  const dimensions = useMemo(() => {
    if (typeof size === 'number') {
      return {
        width: size,
        height: size,
        fontSize: Math.floor(size * 0.43) // 43% от размера
      };
    }
    
    const sizes = {
      small: { width: 32, height: 32, fontSize: 14 },
      medium: { width: 48, height: 48, fontSize: 20 },
      large: { width: 150, height: 150, fontSize: 64 },
      xlarge: { width: 200, height: 200, fontSize: 86 }
    };
    
    return sizes[size] || sizes.medium;
  }, [size]);
  
  const getInitial = () => {
    if (!alt) return '?';
    return alt.charAt(0).toUpperCase();
  };
  
  const shouldShowImage = src && !imageError;
  
  const style = typeof size === 'number' 
    ? {
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        fontSize: `${dimensions.fontSize}px`
      }
    : {};
  return (
    <div 
      className={`${styles.avatar} ${typeof size === 'string' ? styles[size] : ''} ${className} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
      title={alt}
      style={style}
    >
      {shouldShowImage ? (
        <img
          src={`${src}`}
          alt={alt}
          className={styles.image}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div className={styles.placeholder}>
          {getInitial()}
        </div>
      )}
    </div>
  );
};