import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import ButtonIcon from "./ButtonIcon";
import { DarkModeContext } from "@/context/DarkModeContext";
import { useContext } from "react";

function DarkModeToggle() {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);

  return (
    <ButtonIcon onClick={() => setIsDarkMode(!isDarkMode)}>
      {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
    </ButtonIcon>
  );
}

export default DarkModeToggle;
