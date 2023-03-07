import { fontSize, fontWeight, iconSize } from '../styles/size';
import { common, light } from '../styles/themes';
import Degree, { ButtonColor, RadiusType, TextColor } from './../styles/index.d';

export const shallowSelector = (shallow: Degree | undefined): number => {
  if (shallow === "xxs")
    return 0.5
  if (shallow === "xs")
    return 0.15
  if (shallow === "sm")
    return 0.3
  if (shallow === "md")
    return 0.5
  if (shallow === "lg")
    return 0.75
  if (shallow === "xl")
    return 0.8
  if (shallow === "xxl")
    return 0.9
  return 0;
}

export const gapSelector = (gap: Degree | undefined): string => {
  if (gap === "xxs")
    return "2px"
  if (gap === "xs")
    return "6px"
  if (gap === "sm")
    return "12px"
  if (gap === "md")
    return "24px"
  if (gap === "lg")
    return "36px"
  if (gap === "xl")
    return "48px"
  if (gap === "xxl")
    return "64px"
  return "12px";
}

export const fontSizeSelector = (size: Degree | undefined): string => {
  if (size === "xxs")
    return fontSize.xxs
  if (size === "xs")
    return fontSize.xs
  if (size === "sm")
    return fontSize.sm;
  if (size === "md")
    return fontSize.md;
  if (size === "lg")
    return fontSize.lg;
  if (size === "xl")
    return fontSize.xl;
  if (size === "xxl")
    return fontSize.xxl;
  return fontSize.md;
}

export const fontWeightSelector = (weight: Degree | undefined): number => {
  if (weight === "xxs")
    return fontWeight.xxs
  if (weight === "xs")
    return fontWeight.xs
  if (weight === "sm")
    return fontWeight.sm;
  if (weight === "md")
    return fontWeight.md;
  if (weight === "lg")
    return fontWeight.lg;
  if (weight === "xl")
    return fontWeight.xl;
  if (weight === "xxl")
    return fontWeight.xxl;
  return fontWeight.md
}

export const iconSizeSelector = (size: Degree | undefined): string => {
  if (size === "xxs")
    return iconSize.xxs
  if (size === "xs")
    return iconSize.xs
  if (size === "sm")
    return iconSize.sm;
  if (size === "md")
    return iconSize.md;
  if (size === "lg")
    return iconSize.lg;
  if (size === "xl")
    return iconSize.xl;
  if (size === "xxl")
    return iconSize.xxl;
  return iconSize.md
}

export const buttonColorSelector = (color: ButtonColor | undefined): string => {
  if (color === "important")
    return common.button_red
  if (color === "red")
    return common.button_red
  if (color === "common")
    return common.button
  if (color === "blue")
    return common.button_blue
  if (color === "orange")
    return common.button_orange
  if (color === "purple")
    return common.button_purple
  if (color === "green")
    return common.button_green
  if (color === "plain")
    return common.button_plain
  if (color === "transparent")
    return "transparent"
  return common.button_blue
}

export const textColorSelector = (color: TextColor | undefined, theme: typeof light): string => {
  if (color === "common")
    return theme.text
  if (color === "reverse")
    return theme.text_reverse
  if (color === "white")
    return common.text_white
  if (color === "black")
    return common.text_black
  return theme.text
}

export const radiusSelector = (radius: RadiusType | undefined): string => {
  if (radius === "circle")
    return "100%"
  if (radius === "rectangle")
    return "0%"
  if (radius === "sm")
    return "4px"
  if (radius === "md")
    return "8px"
  if (radius === "lg")
    return "12px"
  return "8px"
}