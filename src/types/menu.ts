import type { Dispatch, SetStateAction } from "react";

export type TListPosition = {
  position: {
    x: number;
    y: number;
  };
};

export type TMenus = {
  children: React.ReactElement;
};

export type TMenuContext = {
  openId: number;
  close: () => void;
  open: Dispatch<SetStateAction<number>>;
  position: { x: number; y: number };
  setPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
};

export type TItem = {
  children: React.ReactNode;
};

export type TToggle = {
  id: number;
};

export type TList = {
  children: React.ReactNode;
  id: number;
};

export type TButton = {
  children: string | React.ReactNode;
  icon: React.ReactElement;
  onClick?: () => void;
  disabled?: boolean;
};
