import { create } from "zustand";

interface IselectCompState {
  leftObj: string | undefined;
  rightObj: string | undefined;
  selectObj: HTMLElement | undefined;
  setLeftObj: (select: string | undefined) => void;
  setRightObj: (select: string | undefined) => void;
  setSelectObj: (select: HTMLElement | undefined) => void;
}

export const useStore = create<IselectCompState>((set) => ({
  leftObj: undefined,
  rightObj: undefined,
  selectObj: undefined,
  setLeftObj: (select) => {
    set((state) => ({ ...state, selectComp: select }));
  },
  setRightObj: (select) => {
    set((state) => ({ ...state, selectComp: select }));
  },
  setSelectObj: (select) => {
    set((state) => ({ ...state, selectComp: select }));
  }
}));