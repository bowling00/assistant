import styles from './index.module.less';

export interface CardProps {
  Content: React.ReactNode;
  Footer: React.ReactNode;
}

export const Card = ({ Content, Footer }: CardProps) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardContent}>{Content}</div>
      <div className={styles.cardFooter}>{Footer}</div>
    </div>
  );
};
