import './normalize.css';

import { useEffect, useState } from 'react';

import Conversation from './components/Conversation';
import Home from './components/Home';
import PageContainer from './components/PageContainer';
import { useTTSInit } from './hooks/useTTS';
import { AppState, useSettingStore } from './store/setting';
import { useTTSStore } from './store/tts';

function App() {
  const { appState } = useSettingStore();
  const init = useTTSInit();

  useEffect(() => {
    init();
  }, []);

  const getApp = () => {
    if (appState === AppState.conversation) {
      return <Conversation />;
    } else {
      return <Home />;
    }
  };

  return <PageContainer>{getApp()}</PageContainer>;
}

export default App;
