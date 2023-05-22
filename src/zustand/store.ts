import { create } from "zustand";

interface IselectCompState {
  selectObj: string | undefined;
  setSelectObj: (select: string | undefined) => void;
}

export const useStore = create<IselectCompState>((set) => ({
  selectObj: undefined,
  setSelectObj: (select) => {
    set((state) => ({ ...state, selectObj: select }));
  }
}));