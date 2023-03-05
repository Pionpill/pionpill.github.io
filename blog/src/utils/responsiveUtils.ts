import { breakpoints } from "../styles/measure";


export const isPhone = (): boolean => {
  return document.body.clientWidth < Number(breakpoints.phone.replace("px", ""));
}

export const isTablet = (): boolean => {
  return document.body.clientWidth < Number(breakpoints.tablet.replace("px", ""));
}