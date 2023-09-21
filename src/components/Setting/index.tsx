import { Button, Form, Modal, Popover, Switch } from '@douyinfe/semi-ui';
import { useState } from 'react';

import { getProjectDetail } from '../../api/project';
import { DocIF, useSettingStore } from '../../store/setting';
import { ToastSuccess } from '../../utils/common';
import styles from './index.module.less';

interface DocModal {
  projectId: string;
}

export const Setting = () => {
  const { setting, updateSetting } = useSettingStore();
  const { siriMode, autoSpeech, speech, maxContext, doc } = setting;
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [docModalLoading, setDocModalLoading] = useState(false);

  const docBindHandle = (values: DocModal) => {
    const { projectId } = values;
    setDocModalLoading(true);
    getProjectDetail(projectId)
      .then((res) => {
        console.log(res.data);
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
        setDocModalVisible(false);
        ToastSuccess('绑定成功');
      })
      .finally(() => {
        setDocModalLoading(false);
      });
  };

  const unbindDoc = () => {
    updateSetting({
      ...setting,
      doc: null,
    });
  };
  return (
    <>
      <div className={styles.settingContainer}>
        <div className={styles.settingItem}>
          <div className={styles.title}>绑定私有知识库</div>
          <div className={styles.content}>
            <div className={styles.docContainer}>
              <div className={styles.docName}>
                <Popover content={doc?.name} position="top">
                  {doc?.name || '无'}
                </Popover>
              </div>
              <div className={styles.docOpenModal}>
                <Button size="small" onClick={() => setDocModalVisible(true)}>
                  绑定
                </Button>
                <Button size="small" type="warning" onClick={unbindDoc}>
                  解绑
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.settingItem}>
          <div className={styles.title}>开启 Siri 模式</div>
          <div className={styles.content}>
            <div className={styles.siriControll}>
              <Switch
                checked={siriMode}
                onChange={(v) => updateSetting({ ...setting, siriMode: v })}
                aria-label="autoSpeech"
              ></Switch>
            </div>
          </div>
        </div>
        <div className={styles.settingItem}>
          <div className={styles.title}>对话后自动朗读</div>
          <div className={styles.content}>
            <div className={styles.autoSpeech}>
              <Switch
                checked={autoSpeech}
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
            <div className={styles.maxContext}>
              {maxContext}
              <Button>修改</Button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={'绑定知识库'}
        footer={null}
        visible={docModalVisible}
        onCancel={() => setDocModalVisible(false)}
        closeOnEsc
        width={400}
        zIndex={99999}
      >
        <Form
          onSubmit={(values: DocModal) => docBindHandle(values)}
          style={{
            padding: '0 10px 30px 10px',
          }}
        >
          {() => (
            <>
              <Form.Input
                field="projectId"
                label="知识库 ID"
                initValue={doc?.id || ''}
                style={{ width: '100%' }}
                placeholder="请输入知识库 ID"
                rules={[{ required: true, message: '请输入知识库 ID' }]}
              ></Form.Input>
              <div className={styles.docModalItem}>
                <div className={styles.title}>知识库名字</div>
                <div className={styles.name}>
                  <Popover content={doc?.description}>
                    {docModalLoading
                      ? '绑定中...'
                      : doc?.name || '输入知识库 ID 后点击绑定进行查询'}
                  </Popover>
                </div>
              </div>
              <div
                style={{
                  width: '100%',
                  margin: '0 auto',
                  marginTop: 20,
                }}
              >
                <Button
                  htmlType="submit"
                  type="primary"
                  theme="solid"
                  loading={docModalLoading}
                  style={{
                    width: '100%',
                  }}
                >
                  绑定
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};
