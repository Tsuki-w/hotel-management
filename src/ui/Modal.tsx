import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { createContext, useState, useContext, cloneElement } from "react";
import { useOutSideClick } from "@/hooks/useOutSideClick";
import type { TModalContext, TOpen, TWindow } from "@/types/Modal";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-500);
  }
`;

const ModalContext = createContext<TModalContext | undefined>(undefined);

function Modal({ children }: { children: React.ReactNode }) {
  const [openName, setOpenName] = useState<string>("");
  const close = () => setOpenName("");
  const open = setOpenName;
  return (
    <ModalContext.Provider
      value={{
        openName,
        close,
        open,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }: TOpen) {
  const { open } = useContext(ModalContext) as TModalContext;
  // 创建一个新的元素，将onClick事件处理函数添加到元素上
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

// 根据openName显示弹窗
function Window({ children, name }: TWindow) {
  const { openName, close } = useContext(ModalContext) as TModalContext;
  const { nodeRef } = useOutSideClick<HTMLDivElement>(close, true);

  if (name !== openName) {
    return null;
  }
  // createPortal将Modal渲染到body上
  return createPortal(
    <Overlay>
      <StyledModal ref={nodeRef}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body,
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
