import { useSelector } from 'react-redux';
import { RootState } from '../store/index';

export const useThemeChoice = (light: any, dark: any) => {
  return useSelector((state: RootState) => state.root.theme) === "light" ? light : dark;
}