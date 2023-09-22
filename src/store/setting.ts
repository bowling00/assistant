import { create } from 'zustand';

import { hideLive2dGirls, showLive2dGirls } from '../utils/live2d';

export enum AppState {
  welcome = 'welcome',
  conversation = 'conversation',
  newConversation = 'newConversation',
  setting = 'setting',
}

enum SpeechList {
  'zh-CN-XiaochenNeural' = 'zh-CN-XiaochenNeural',
}

export interface DocIF {
  id: string;
  name: string;
  description: string;
}
export interface SettingIF {
  siriMode: boolean;
  autoSpeech: boolean;
  speech: SpeechList;
  maxContext: number;
  doc: DocIF | null;
}

interface State {
  appState: AppState;
  setting: SettingIF;
  settingVisible: boolean;
}

interface SettingStore extends State {
  updateAppState: (appState: AppState) => void;
  updateSetting: (setting: SettingIF) => void;
  updateSettingVisible: (visible: boolean) => void;
}

export const setting_tip = '_JS_SIRI_SETTING_';

export const useSettingStore = create<SettingStore>((set, get) => ({
  appState: AppState.welcome,
  setting: {
    siriMode: false,
    autoSpeech: true,
    speech: SpeechList['zh-CN-XiaochenNeural'],
    maxContext: 4,
    doc: null,
  },
  settingVisible: false,

  updateAppState: (appState) => {
    set({ appState });

    const cache = {
      setting: get().setting,
      settingVisible: get().settingVisible,
    };
    setCache(cache);
  },

  updateSetting: (setting) => {
    set({ setting });

    if (setting.siriMode) {
      showLive2dGirls();
    } else {
      hideLive2dGirls();
    }
    const cache = {
      setting,
      settingVisible: get().settingVisible,
    };
    setCache(cache);
  },

  updateSettingVisible: (settingVisible) => {
    set({ settingVisible });
  },
}));

type CacheState = Omit<State, 'appState'>;

const setCache = (cache: CacheState) => {
  localStorage.setItem(setting_tip, JSON.stringify(cache));
};
