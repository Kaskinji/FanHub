// components/UI/InfoBox/InfoBox.tsx
import React from 'react';
import styles from './InfoBox.module.scss';

interface InfoBoxProps {
  title: string;
  info: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, info }) => {
  return (
    <div className={styles.infoBox}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.info}>{info}</p>
    </div>
  );
};

export default InfoBox;