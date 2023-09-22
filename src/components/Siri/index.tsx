import { IconMicrophone, IconSend } from '@douyinfe/semi-icons';
import { Button, Input } from '@douyinfe/semi-ui';
import { FC, useEffect, useState } from 'react';

import {
  conversation,
  Message,
  MessageRole,
  similaritySearchResponseItem,
} from '../../api/conversation';
import { similaritySearchFromDocs } from '../../api/project';
import useBrowserSpeechToText, {
  SupportedLanguages,
} from '../../hooks/BrowserSpeechToText';
import { useSettingStore } from '../../store/setting';
import { useTTSStore } from '../../store/tts';
import { ToastWaring } from '../../utils/common';
import { updateLive2dChatAnswer } from '../../utils/live2d';
import styles from './index.module.less';

interface SiriModeProps {
  projectId?: string;
}

export const SiriMode: FC<SiriModeProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const { transcript, isListening, setIsListening } = useBrowserSpeechToText({
    language: SupportedLanguages['zh-CN'],
  });
  const [chatList, setChatList] = useState<Partial<Message>[]>([
    {
      content: '我叫 JS Siri，是你的 AI 助理',
      role: MessageRole.system,
    },
  ]);
  const [content, setContent] = useState('');
  const speak = useTTSStore((state) => state.speak);
  const { setting } = useSettingStore();

  const docSearch = async () => {
    const id = setting?.doc?.id;
    const name = setting?.doc?.name;
    if (!id && !name) {
      return [];
    }
    const size = 2;
    const searchVectorFromDocsFunc = (): Promise<similaritySearchResponseItem[]> => {
      return new Promise((resolve) => {
        similaritySearchFromDocs({ content, projectId: id as string, size })
          .then((res) => {
            resolve(res.data);
          })
          .catch(() => {
            resolve([]);
          });
      });
    };

    const contexts = await searchVectorFromDocsFunc();

    const systemMessages = contexts.map((context) => {
      return {
        content: context.pageContent,
        role: MessageRole.system,
      };
    });
    return systemMessages;
  };

  const sendMessage = async () => {
    if (loading) return;
    if (!content) {
      ToastWaring('请输入内容');
      return;
    }
    setLoading(true);
    const humanContent = `${content}`;
    const humanMessage = {
      content: humanContent,
      role: MessageRole.human,
    };
    const systemMessages = await docSearch();
    const chatHistory = [...chatList.slice(1)]
      .filter((item) => item.role !== MessageRole.system)
      .slice(-setting.maxContext);
    const messages = [...chatHistory, ...systemMessages, humanMessage];
    const projectId = setting?.doc?.id;
    conversation({ messages, projectId })
      .then((res) => {
        const result = {
          content: res.data,
          role: MessageRole.ai,
        };
        const svaeMessages = [
          ...chatHistory,
          { content: content, role: MessageRole.human },
        ];
        setChatList([...svaeMessages, result]);
        const autoSpeech = setting.autoSpeech;
        if (autoSpeech) {
          speech(result.content);
        }
        updateLive2dChatAnswer(result.content);
      })
      .finally(() => {
        setContent('');
        setLoading(false);
      });
  };

  const speech = (content: string) => {
    speak(content, () => {
      console.log('speak done');
    });
  };

  const speechToText = () => {
    setIsListening(!isListening);
  };

  useEffect(() => {
    setContent(transcript);
  }, [transcript]);

  useEffect(() => {
    if (content) {
      sendMessage();
    }
  }, [content]);

  return (
    <div className={styles.chatComponent}>
      <div className={styles.sendContainer}>
        <Input
          showClear
          value={content}
          onChange={setContent}
          className={styles.sendInput}
        ></Input>
        <Button
          theme="solid"
          onClick={speechToText}
          // loading={isListening}
          className={styles.sendBtn}
          size="small"
          disabled={loading}
        >
          <IconMicrophone />
          {isListening && <>录音中</>}
        </Button>
        <Button
          icon={<IconSend />}
          theme="solid"
          onClick={sendMessage}
          loading={loading}
          className={styles.sendBtn}
          size="small"
        />
      </div>
    </div>
  );
};
