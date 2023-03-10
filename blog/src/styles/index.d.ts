type Degree = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
export type ButtonColor = "red" | "important" | "common" | "blue" | "orange" | "purple" | "green" | "plain" | "transparent"
export type TextColor = "common" | "reverse" | "white" | "black"
export type RadiusType = "circle" | "rectangle" | Degree
export interface Theme {
  text: string
  text_reverse: string
  background: string
  background_second: string
  main: string
}

export default Degree;