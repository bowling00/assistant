import { create } from 'zustand';

export enum AppState {
  welcome,
  conversation,
  newConversation,
  setting,
}

interface SettingStore {
  appState: AppState;

  updateAppState: (appState: AppState) => void;
}

export const useSettingStore = create<SettingStore>((set) => ({
  appState: AppState.welcome,
  updateAppState: (appState) => {
    set({ appState });
  },
}));
