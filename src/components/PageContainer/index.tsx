import { FC } from 'react';

import styles from './index.module.less';

interface PageContainerIF {
  children: React.ReactNode;
}

const PageContainer: FC<PageContainerIF> = ({ children }) => {
  return <div className={styles.pageContainer}>{children}</div>;
};

export default PageContainer;
