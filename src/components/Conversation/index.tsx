import { IconCopy, IconMicrophone, IconSend } from '@douyinfe/semi-icons';
import { Button, Input, Spin } from '@douyinfe/semi-ui';
import ClassNames from 'classnames';
import { FC, useEffect, useMemo, useState } from 'react';

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
import { handleCopy } from '../../utils/common';
import { updateLive2dChatAnswer } from '../../utils/live2d';
import Layout from '../Layout';
import styles from './index.module.less';

const Conversation = () => {
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
  const getMessageList = useMemo(() => {
    return chatList
      .filter((item) => item.role !== MessageRole.system)
      .map((message) => {
        return (
          <div className={styles.message} key={message.createdAt}>
            <div
              className={ClassNames({
                [styles.messageContainer]: true,
                [styles.systemMessage]: message.role === MessageRole.system,
                [styles.aiMessage]: message.role === MessageRole.ai,
                [styles.humanMessage]: message.role === MessageRole.human,
              })}
            >
              <div
                className={ClassNames({
                  [styles.messageContent]: true,
                  [styles.systemContent]: message.role === MessageRole.system,
                  [styles.aiContent]: message.role === MessageRole.ai,
                  [styles.humanContent]: message.role === MessageRole.human,
                })}
              >
                {message.content}
              </div>
              <div
                className={ClassNames({
                  [styles.messageControll]: true,
                  [styles.systemControll]: message.role === MessageRole.system,
                  [styles.aiControll]: message.role === MessageRole.ai,
                  [styles.humanControll]: message.role === MessageRole.human,
                })}
              >
                <Button
                  icon={<IconMicrophone size="small" />}
                  className={styles.sendBtn}
                  onClick={() => speak(message.content as string)}
                  size="small"
                  disabled={loading}
                />
                <Button
                  icon={<IconCopy size="small" />}
                  className={styles.sendBtn}
                  onClick={() => handleCopy(message.content as string)}
                  size="small"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        );
      });
  }, [chatList.length, loading]);

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
    setLoading(true);
    // prompt
    const humanContent = `${content}`;
    const humanMessage = {
      content: humanContent,
      role: MessageRole.human,
    };
    const systemMessages = await docSearch();
    const messages = [...chatList.slice(1), ...systemMessages, humanMessage];
    const projectId = setting?.doc?.id;
    conversation({ messages, projectId })
      .then((res) => {
        const result = {
          content: res.data,
          role: MessageRole.ai,
        };
        const svaeMessages = [
          ...chatList.slice(1),
          ...systemMessages,
          { content: content, role: MessageRole.human },
        ];
        setChatList([...chatList, ...svaeMessages, result]);
        speech(result.content);
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

  return (
    <Layout>
      <div className={styles.chatComponent}>
        <div className={styles.header}>Js Siri</div>
        <div className={styles.messageList}>{getMessageList}</div>
        <div className={styles.sendContainer}>
          <Input
            showClear
            value={content}
            onChange={setContent}
            className={styles.sendInput}
          ></Input>
          <Button
            icon={<IconMicrophone />}
            theme="solid"
            onClick={speechToText}
            // loading={isListening}
            className={styles.sendBtn}
            size="small"
            disabled={loading}
          >
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
    </Layout>
  );
};

export default Conversation;
