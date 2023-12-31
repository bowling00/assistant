import { Button, Form, Input, Modal, Popover, Switch } from '@douyinfe/semi-ui';
import { useState } from 'react';

import { getProjectDetail } from '../../api/project';
import { DocIF, useSettingStore } from '../../store/setting';
import { ToastError, ToastSuccess, ToastWaring } from '../../utils/common';
import styles from './index.module.less';

interface DocModal {
  projectId: string;
}

export const Setting = () => {
  const { setting, updateSetting } = useSettingStore();
  const { siriMode, autoSpeech, speech, maxContext, doc } = setting;
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [docModalLoading, setDocModalLoading] = useState(false);
  const [maxContentInputValue, setMaxContentInputValue] = useState(maxContext);
  const docBindHandle = (values: DocModal) => {
    const { projectId } = values;
    setDocModalLoading(true);
    getProjectDetail(projectId)
      .then((res) => {
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
          setDocModalVisible(false);
          ToastSuccess('绑定成功');
        } else {
          return Promise.reject(res);
        }
      })
      .catch(() => {
        ToastError('绑定失败，未查询到该应用');
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
    ToastSuccess('解绑成功');
  };

  const updateMaxContentInputValue = () => {
    if (maxContentInputValue > 10 || maxContentInputValue < 1) {
      ToastWaring('最小为1，最大为10');
      return;
    }
    updateSetting({
      ...setting,
      maxContext: maxContentInputValue,
    });
    ToastSuccess('修改成功');
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
                {doc?.name && (
                  <Button size="small" type="warning" onClick={unbindDoc}>
                    解绑
                  </Button>
                )}
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
          <div className={styles.title}>朗读的声音</div>
          <div className={styles.content}>
            <div className={styles.speechList}>{speech}</div>
          </div>
        </div>
        <div className={styles.settingItem}>
          <div className={styles.title}>最长上下文条数</div>
          <div className={styles.content}>
            <div className={styles.maxContext}>
              <Input
                defaultValue={maxContentInputValue}
                onChange={(v) => setMaxContentInputValue(Number(v))}
                max={10}
                min={1}
                placeholder={'最小为1，最大为10'}
              />
              <Button onClick={updateMaxContentInputValue}>修改</Button>
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
        width={360}
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
                label="应用 ID"
                initValue={doc?.id || ''}
                style={{ width: '100%' }}
                placeholder="请输入应用 ID"
                rules={[{ required: true, message: '请输入应用 ID' }]}
              ></Form.Input>
              <div className={styles.docModalItem}>
                <div className={styles.title}>如何拥有应用 ID ?</div>
                <div className={styles.name}>
                  请在
                  <a
                    href="https://docs-copilot.devlink.wiki/"
                    target="_black"
                    style={{ fontWeight: 600, margin: '0 .5rem' }}
                  >
                    docs-copilot
                  </a>
                  中创建「应用」和「知识库」，并在应用中绑定知识库
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
