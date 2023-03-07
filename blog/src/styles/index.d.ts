type Degree = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
export type ButtonColor = "red" | "important" | "common" | "blue" | "orange" | "purple" | "green" | "plain" | "transparent"
export type TextColor = "common" | "reverse" | "white" | "black"
export type RadiusType = "circle" | "rectangle" | "sm" | "md" | "lg"
export interface Theme {
  text: string
  text_reverse: string
  background: string
  main: string
}

export default Degree;