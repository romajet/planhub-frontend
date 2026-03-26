import { create } from 'zustand';

interface UiState {
  isTaskDrawerOpen: boolean;
  selectedTaskId: string | null;
  openTaskDrawer: (taskId: string) => void;
  closeTaskDrawer: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isTaskDrawerOpen: false,
  selectedTaskId: null,

  openTaskDrawer: (taskId) => set({ isTaskDrawerOpen: true, selectedTaskId: taskId }),
  closeTaskDrawer: () => set({ isTaskDrawerOpen: false, selectedTaskId: null }),
}));
