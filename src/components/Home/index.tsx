import { Button } from '@douyinfe/semi-ui';

import { AppState, useSettingStore } from '../../store/setting';
import { Card } from '../Card';
import Header from '../Header';
import Layout from '../Layout';
import styles from './index.module.less';

const Home = () => {
  const { updateAppState } = useSettingStore();

  const getCardContent = () => {
    return (
      <div className={styles.cardContent}>
        <div className={styles.cardContentTitle}>JS Siri</div>
        <div className={styles.cardContentdes}>
          我是 AI Assistant，使用 gpt 3.5
          模型，你也可以通过接入私有知识库，来提升我的知识面
        </div>
      </div>
    );
  };

  const getCardFooter = () => {
    return (
      <footer className={styles.cardFooter}>
        <Button size="small">设置</Button>
        <Button size="small" type="primary" theme="solid" onClick={gotoConversation}>
          开始对话
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
