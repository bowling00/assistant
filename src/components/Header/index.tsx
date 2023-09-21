import { IconList, IconSetting } from '@douyinfe/semi-icons';
import { SideSheet } from '@douyinfe/semi-ui';
import { useState } from 'react';

import { AppState, useSettingStore } from '../../store/setting';
import { Setting } from '../Setting';
import { SiriMode } from '../Siri';
import styles from './index.module.less';

const Header = () => {
  const { appState, updateAppState, setting, updateSetting } = useSettingStore();
  const { siriMode } = setting;
  const [lastAppState, setLastAppState] = useState<AppState>(appState);
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <IconList />
      </div>
      <div className={styles.headerRight}>
        <IconSetting onClick={() => updateAppState(AppState.setting)} />
      </div>
      <SideSheet
        title="设置"
        visible={appState === AppState.setting}
        onCancel={() => updateAppState(lastAppState)}
        placement="right"
        height="100%"
      >
        <Setting />
      </SideSheet>
      <SideSheet
        title="Siri"
        visible={siriMode}
        onCancel={() => updateSetting({ ...setting, siriMode: false })}
        placement="top"
        height="100%"
      >
        <SiriMode />
      </SideSheet>
    </header>
  );
};

export default Header;
