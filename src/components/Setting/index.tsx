import { Switch } from '@douyinfe/semi-ui';

import { useSettingStore } from '../../store/setting';
import styles from './index.module.less';

// export interface SettingProps {

// }

export const Setting = () => {
  const { setting, updateSetting } = useSettingStore();
  const { siriMode, autoSpeech, speech, maxContext } = setting;
  return (
    <div className={styles.settingContainer}>
      <div className={styles.settingItem}>
        <div className={styles.title}>绑定私有知识库</div>
        <div className={styles.content}>
          <div className={styles.docContainer}>绑定私有知识库</div>
        </div>
      </div>
      <div className={styles.settingItem}>
        <div className={styles.title}>开启 Siri 模式</div>
        <div className={styles.content}>
          <div className={styles.siriControll}>
            <div className={styles.autoSpeech}>
              <Switch
                defaultChecked={siriMode}
                onChange={(v) => updateSetting({ ...setting, siriMode: v })}
                aria-label="autoSpeech"
              ></Switch>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.settingItem}>
        <div className={styles.title}>对话后自动朗读</div>
        <div className={styles.content}>
          <div className={styles.autoSpeech}>
            <Switch
              defaultChecked={autoSpeech}
              onChange={(v, e) => updateSetting({ ...setting, autoSpeech: v })}
              aria-label="autoSpeech"
            ></Switch>
          </div>
        </div>
      </div>
      <div className={styles.settingItem}>
        <div className={styles.title}>选择朗读的声音</div>
        <div className={styles.content}>
          <div className={styles.speechList}>{speech}</div>
        </div>
      </div>
      <div className={styles.settingItem}>
        <div className={styles.title}>最长上下文条数</div>
        <div className={styles.content}>
          <div className={styles.maxContext}>{maxContext}</div>
        </div>
      </div>
    </div>
  );
};
