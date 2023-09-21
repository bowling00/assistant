import { FC, useEffect } from 'react';

import { setting_tip, useSettingStore } from '../../store/setting';
import styles from './index.module.less';

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: FC<PageContainerProps> = ({ children }) => {
  const { updateAppState, updateSetting, appState, setting } = useSettingStore();
  const cacheFromStorge = localStorage.getItem(setting_tip);
  const cache = cacheFromStorge ? JSON.parse(cacheFromStorge) : {};
  useEffect(() => {
    if (cache) {
      updateAppState({
        ...cache.appState,
        appState,
      });
      updateSetting({
        ...cache.setting,
        ...setting,
      });
    }
  }, []);
  return <div className={styles.pageContainer}>{children}</div>;
};

export default PageContainer;
