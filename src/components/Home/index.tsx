import { Button } from '@douyinfe/semi-ui';

import { AppState, useSettingStore } from '../../store/setting';
import { Card } from '../Card';
import Header from '../Header';
import Layout from '../Layout';
import styles from './index.module.less';

const Home = () => {
  const { updateAppState, updateSettingVisible, setting, updateSetting } =
    useSettingStore();

  const getCardContent = () => {
    return (
      <div className={styles.cardContent}>
        <div className={styles.cardContentTitle}>JS Siri</div>
        <div className={styles.cardContentdes}>
          我是 AI 助手，你可以连接私有知识库，为你打造专属的 Siri 体验
        </div>
      </div>
    );
  };

  const getCardFooter = () => {
    return (
      <footer className={styles.cardFooter}>
        <Button type="primary" theme="solid" onClick={gotoConversation}>
          开始对话
        </Button>
        <Button onClick={() => updateSettingVisible(true)}>设置</Button>
        <Button onClick={() => updateSetting({ ...setting, siriMode: true })}>
          Siri 模式
        </Button>
      </footer>
    );
  };

  const gotoConversation = () => {
    updateAppState(AppState.conversation);
  };

  return (
    <Layout>
      <div className={styles.homeContainer}>
        <div className={styles.content}>
          <div className={styles.card}>
            <Card Content={getCardContent()} Footer={getCardFooter()} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
