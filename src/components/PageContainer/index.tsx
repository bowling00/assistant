import { FC } from 'react';

import styles from './index.module.less';

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: FC<PageContainerProps> = ({ children }) => {
  return <div className={styles.pageContainer}>{children}</div>;
};

export default PageContainer;
