import { FC, useEffect } from 'react';

import { getProjectDetail } from '../../api/project';
import { DocIF, setting_tip, useSettingStore } from '../../store/setting';
import styles from './index.module.less';

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: FC<PageContainerProps> = ({ children }) => {
  const { updateAppState, updateSetting, appState, setting } = useSettingStore();
  const cacheFromStorge = localStorage.getItem(setting_tip);
  const cache = cacheFromStorge ? JSON.parse(cacheFromStorge) : {};
  const currentUrl = new URL(window.location.href);

  const docId = currentUrl.searchParams.get('docId');
  useEffect(() => {
    if (cache) {
      updateAppState({
        appState,
        ...cache.appState,
      });
      updateSetting({
        ...setting,
        ...cache.setting,
      });
    }

    if (docId) {
      getProjectDetail(docId).then((res) => {
        if (res.data) {
          const { id, description, name } = res.data;
          const doc: DocIF = {
            id,
            description,
            name,
          };
          updateSetting({
            ...setting,
            doc,
          });
        }
      });
    }
  }, []);
  return <div className={styles.pageContainer}>{children}</div>;
};

export default PageContainer;
