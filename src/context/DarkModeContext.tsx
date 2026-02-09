import { createContext, useEffect } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import type { Dispatch, SetStateAction } from "react";

type TDarkModeContext = {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
};

type IProps = {
  children: React.ReactNode;
};
// eslint-disable-next-line react-refresh/only-export-components
export const DarkModeContext = createContext<TDarkModeContext>({
  isDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
  setIsDarkMode: () => {},
});

export function DarkModeProvider({ children }: IProps) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState<boolean>(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
    "darkMode",
  );
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.add("light-mode");
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);
  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
