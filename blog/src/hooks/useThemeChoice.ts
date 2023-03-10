import { useSelector } from 'react-redux';
import { RootState } from '../store/index';

const useThemeChoice: any = (light: any, dark: any) => {
  return useSelector((state: RootState) => state.root.theme) === "light" ? light : dark;
}

export default useThemeChoice;