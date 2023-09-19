import { IconSend } from '@douyinfe/semi-icons';
import { Button, Input } from '@douyinfe/semi-ui';
import { FC, useMemo, useState } from 'react';

import {
  conversation,
  Message,
  MessageRole,
  similaritySearchResponseItem,
} from '../../api/conversation';
import { similaritySearchFromDocs } from '../../api/project';
import { useTTSStore } from '../../store/tts';
import { ToastInfo, ToastSuccess } from '../../utils/common';
import styles from './index.module.less';

interface ConversationProps {
  projectId?: string;
}

const Conversation: FC<ConversationProps> = ({ projectId }) => {
  const [loading, setLoading] = useState(false);
  const [chatList, setChatList] = useState<Partial<Message>[]>([
    {
      content: '我是聪明的 JS Siri',
    },
  ]);
  const [content, setContent] = useState('');
  const size = 2;
  const speak = useTTSStore((state) => state.speak);

  const getMessageList = useMemo(() => {
    return chatList
      .filter((item) => item.role !== MessageRole.system)
      .map((message) => {
        return (
          <div className={styles.message} key={message.createdAt}>
            <div className={styles.messageContent}>
              {message.role && `${message.role} :`} {message.content}
            </div>
            <div className={styles.messageTime}>{message.createdAt}</div>
          </div>
        );
      });
  }, [chatList.length]);

  const docSearch = async () => {
    if (!projectId) return [];

    const searchVectorFromDocsFunc = (): Promise<similaritySearchResponseItem[]> => {
      return new Promise((resolve, reject) => {
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

  return (
    <div className={styles.chatComponent}>
      <div className={styles.messageList}>{getMessageList}</div>
      <div className={styles.sendContainer}>
        <Input showClear value={content} onChange={setContent}></Input>
        <Button
          icon={<IconSend />}
          theme="solid"
          style={{ marginRight: 10 }}
          onClick={sendMessage}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Conversation;
