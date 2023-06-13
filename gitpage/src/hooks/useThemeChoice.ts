import { useSelector } from "react-redux";
import { RootState } from "../stores";

/**
 * 针对不同颜色主题返回不同的值
 * @param light 白色主题返回值
 * @param dark 黑色主题返回值
 * @returns 不同颜色模式下的返回值
 */
const useThemeChoice = (light: any, dark: any) => {
  return useSelector((state: RootState) => state.app.theme) === "light"
    ? light
    : dark;
};

export default useThemeChoice;
