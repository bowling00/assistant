import { IconList, IconSetting } from '@douyinfe/semi-icons';

import styles from './index.module.less';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <IconList />
      </div>
      <div className={styles.headerRight}>
        <IconSetting />
      </div>
    </header>
  );
};

export default Header;
