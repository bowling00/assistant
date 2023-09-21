import { FC } from 'react';

import Header from '../Header';
import styles from './index.module.less';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.LayoutContainer}>
      <Header />
      <div className={styles.layoutContent}>{children}</div>
    </div>
  );
};

export default Layout;
