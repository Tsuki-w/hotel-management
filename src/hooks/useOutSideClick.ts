import { useEffect, useRef } from "react";

export const useOutSideClick = <T extends HTMLElement>(
  handler: () => void,
  listenCapturing: boolean = true,
) => {
  const nodeRef = useRef<T>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 如果点击的区域在绑定的DOM外则触发
      if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
        handler();
      }
    };
    document.addEventListener("click", handleClick, listenCapturing);
    return () => {
      document.removeEventListener("click", handleClick, listenCapturing);
    };
  }, [handler, listenCapturing]);
  return {
    nodeRef,
  };
};
