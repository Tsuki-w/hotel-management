import type { Dispatch, SetStateAction } from "react";

export type TModalContext = {
  openName: string;
  close: () => void;
  open: Dispatch<SetStateAction<string>>;
};

export type TOpen = {
  // 子元素必须是一个能接受 HTML 属性的 React 元素
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  opens: string;
};

export type TWindow = {
  children: React.ReactElement<
    React.HTMLAttributes<HTMLElement> & {
      onCloseModal: React.MouseEventHandler<HTMLElement>;
    }
  >;
  name: string;
};
