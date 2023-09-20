import { IconMicrophone, IconSend } from '@douyinfe/semi-icons';
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
import useBrowserSpeechToText from '../../hooks/BrowserSpeechToText';
import { useTTSStore } from '../../store/tts';
import { ToastInfo, ToastSuccess } from '../../utils/common';
import Layout from '../Layout';
import styles from './index.module.less';

interface ConversationProps {
  projectId?: string;
}

const Conversation: FC<ConversationProps> = ({ projectId }) => {
  const [loading, setLoading] = useState(false);
  const language = 'zh-CN';
  const { transcript, isListening, setIsListening } = useBrowserSpeechToText({
    language,
  });
  const [chatList, setChatList] = useState<Partial<Message>[]>([
    {
      content: '我是聪明的 JS Siri',
      role: MessageRole.system,
    },
    {
      content: '我是聪明的 人类',
      role: MessageRole.human,
    },
    {
      content: '我是聪明的 AI',
      role: MessageRole.ai,
    },
    {
      content: '我是聪明的 JS Siri',
      role: MessageRole.system,
    },
    {
      content: '我是聪明的 人类',
      role: MessageRole.human,
    },
    {
      content: '我是聪明的 AI',
      role: MessageRole.ai,
    },
    {
      content: '我是聪明的 JS Siri',
      role: MessageRole.system,
    },
    {
      content: '我是聪明的 人类',
      role: MessageRole.human,
    },
    {
      content: '我是聪明的 AI',
      role: MessageRole.ai,
    },
  ]);
  const [content, setContent] = useState('');
  const size = 2;
  const speak = useTTSStore((state) => state.speak);

  const getMessageList = useMemo(() => {
    return (
      chatList
        // .filter((item) => item.role !== MessageRole.system)
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
              </div>
            </div>
          );
        })
    );
  }, [chatList.length]);

  const docSearch = async () => {
    if (!projectId) return [];

    const searchVectorFromDocsFunc = (): Promise<similaritySearchResponseItem[]> => {
      return new Promise((resolve) => {
        similaritySearchFromDocs({ content, projectId, size })
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
    conversation({ messages })
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
        ToastInfo('speech start debug');
        speech(result.content);
        ToastSuccess('speech end debug');
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
            {isListening && <Spin />}
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
