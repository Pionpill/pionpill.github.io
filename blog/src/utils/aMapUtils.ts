type AMapStyle = "macaron" | "graffiti" | "normal" | "whitesmoke" | "dark" | "fresh" | "darkblue" | "blue" | "light" | "grey"

export const styleSelector = (style: AMapStyle | undefined) => {
  const prefix = "amap://styles/";
  if (style) return prefix + style;
  else return prefix + "normal";
};