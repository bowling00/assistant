import { create } from 'zustand';

export enum AppState {
  welcome,
  conversation,
  newConversation,
  setting,
}

enum SpeechList {
  'zh-CN-XiaochenNeural' = 'zh-CN-XiaochenNeural',
}

interface Setting {
  siriMode: boolean;
  autoSpeech: boolean;
  speech: SpeechList;
  maxContext: number;
}

interface SettingStore {
  appState: AppState;
  setting: Setting;

  updateAppState: (appState: AppState) => void;
  updateSetting: (setting: Setting) => void;
}

export const useSettingStore = create<SettingStore>((set) => ({
  appState: AppState.welcome,
  setting: {
    siriMode: false,
    autoSpeech: true,
    speech: SpeechList['zh-CN-XiaochenNeural'],
    maxContext: 4,
  },

  updateAppState: (appState) => {
    set({ appState });
  },
  updateSetting: (setting) => {
    set({ setting });
  },
}));
