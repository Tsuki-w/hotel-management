import styled from "styled-components";
import { createContext, useState, useContext } from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { createPortal } from "react-dom";
import { useOutSideClick } from "@/hooks/useOutSideClick";
import type {
  TListPosition,
  TMenus,
  TMenuContext,
  TItem,
  TToggle,
  TList,
  TButton,
} from "@/types/menu";

const StyledMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul<TListPosition>`
  position: fixed;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);
  left: ${(props) => props.position?.x}px;
  top: ${(props) => props.position?.y}px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

/**
 * 复合组件实现思路：
 * 1. 创建一个统一的context，利用provider包裹所有的子组件传递状态
 * 2. 定义不同的子组件，在子组件中获取状态进行不同的处理
 */

const MenusContext = createContext<TMenuContext | undefined>(undefined);

function Menus({ children }: TMenus) {
  // 打开的菜单id
  const [openId, setOpenId] = useState<number>(0);
  // 菜单位置
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const close = () => setOpenId(0);
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

// 所有菜单的容器
function MenuItem({ children }: TItem) {
  return (
    <>
      <StyledMenu>{children}</StyledMenu>
    </>
  );
}

//未显示菜单时展示的图标
function Toggle({ id }: TToggle) {
  const { openId, close, open, setPosition } = useContext(
    MenusContext,
  ) as TMenuContext;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (!openId || openId !== id) {
      open(id);
    } else {
      close();
    }
    const rect = (e.target as HTMLElement)
      .closest("button")
      ?.getBoundingClientRect();
    // 根据点击位置显示菜单
    if (rect) {
      setPosition({
        x: Math.ceil(rect.x + rect.width),
        y: Math.ceil(rect.y + rect.height),
      });
    }
  }
  return (
    <StyledToggle onClick={(e) => handleClick(e)}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ children, id }: TList) {
  const { openId, position, close } = useContext(MenusContext) as TMenuContext;
  /**
   * 必须采用冒泡处理 不能采用捕获
   * 采用捕获，在未打开状态点击Toogle组件时，事件从document开始触发，符合区域外点击的条件，先执行了关闭，冒泡阶段开始时Toogle组件发现openId为0执行打开逻辑
   * 但此时再次点击Toogle组件，事件又从document开始导致又执行了关闭，冒泡阶段Toogle时openId又为0，又执行打开逻辑导致菜单无法被关闭
   * 采用冒泡执行并阻止冒泡传递，捕获阶段的document不会执行关闭，openId状态能被正确保留
   */
  const { nodeRef } = useOutSideClick<HTMLUListElement>(close, false);
  // const { nodeRef } = useOutSideClick<HTMLUListElement>(close, true);
  if (openId !== id) {
    return null;
  }
  // 将菜单列表渲染到body上便于直接使用fixed定位
  return createPortal(
    <StyledList ref={nodeRef} position={position}>
      {children}
    </StyledList>,
    document.body,
  );
}

function Button({ children, onClick, icon, disabled }: TButton) {
  const { close } = useContext(MenusContext) as TMenuContext;
  const handleClick = () => {
    onClick?.();
    close();
  };
  return (
    <li>
      <StyledButton
        onClick={handleClick}
        disabled={typeof disabled === "boolean" ? disabled : false}
      >
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Item = MenuItem;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
