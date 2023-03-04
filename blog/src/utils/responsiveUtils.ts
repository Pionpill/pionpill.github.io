import breakpoints from "../styles/breakpoints";

export const isPhone = (): boolean => {
  return document.body.clientWidth < Number(breakpoints.phone.replace("px", ""));
}

export const isTablet = (): boolean => {
  return document.body.clientWidth < Number(breakpoints.tablet.replace("px", ""));
}