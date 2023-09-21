import { IconList, IconSetting } from '@douyinfe/semi-icons';
import { SideSheet } from '@douyinfe/semi-ui';
import { useState } from 'react';

import { AppState, useSettingStore } from '../../store/setting';
import { Setting } from '../Setting';
import { SiriMode } from '../Siri';
import styles from './index.module.less';

const Header = () => {
  const { updateAppState, setting, updateSetting, settingVisible, updateSettingVisible } =
    useSettingStore();
  const siriMode = setting?.siriMode || false;

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <IconList />
      </div>
      <div className={styles.headerRight}>
        <IconSetting onClick={() => updateSettingVisible(true)} />
      </div>
      <SideSheet
        title="设置"
        visible={settingVisible}
        onCancel={() => updateSettingVisible(false)}
        placement="right"
        height="100%"
      >
        <Setting />
      </SideSheet>
      <SideSheet
        title="Siri"
        visible={siriMode}
        onCancel={() => updateSetting({ ...setting, siriMode: false })}
        maskClosable
        placement="top"
        height="100%"
      >
        <SiriMode />
      </SideSheet>
    </header>
  );
};

export default Header;
