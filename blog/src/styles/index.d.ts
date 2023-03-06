export type FontSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
export type FontWeight = "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl"
export type ShallowDegree = "xs" | "sm" | "md" | "lg" | "xl"
export type GapDegree = "xs" | "sm" | "md" | "lg" | "xl"
export type ButtonColor = "red" | "important" | "common" | "blue" | "orange" | "purple" | "green" | "plain" | "transparent"
export type TextColor = "common" | "reverse" | "white" | "black"
export type RadiusType = "circle" | "rectangle" | "sm" | "md" | "lg"
interface Theme {
  text: string
  text_reverse: string
  background: string
  main: string
}