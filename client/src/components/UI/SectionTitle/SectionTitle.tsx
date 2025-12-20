import React from 'react';
import styles from './SectionTitle.module.scss';

interface SectionTitleProps {
  title: string;
  wrapperClassName?: string;
  titleClassName?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  wrapperClassName = '',
  titleClassName = '',
}) => {
  return (
    <section className={`${styles.sectionTitleWrapper} ${wrapperClassName}`}>
      <div className={`${styles.sectionTitle} ${titleClassName}`}>
        {title}
      </div>
    </section>
  );
};

export default SectionTitle;