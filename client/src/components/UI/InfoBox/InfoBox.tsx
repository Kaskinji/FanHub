import React from 'react';
import styles from './InfoBox.module.scss';

interface InfoBoxProps {
  title: string;
  info: string;
  className?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, info, className }) => {
  return (
    <div className={`${styles.infoBox} ${className || ''}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.infoContent}>
        <p className={styles.info}>{info}</p>
      </div>
    </div>
  );
};

export default InfoBox;