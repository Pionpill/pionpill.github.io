import { colors } from "./colors";
import { spacing } from "./spacing";


export const base = {
    ...colors,
    ...spacing,
    wrong: colors.red,
    right: colors.green,
    danger: colors.danger
}

export const light = {
    ...base,
    pointer: colors.blue,
    main_light: colors.marine,
    shadow: colors.black,
    important: colors.red,
    background: colors.white,
    background_second: colors.white90,
    background_third: colors.white75,
    header: colors.github_black,
    main: colors.as_black,
    assist: colors.as_black_second,
    text: colors.black90,
    text_second: colors.black75,
    text_third: colors.black50,
    text_reverse: colors.white,
    button: colors.blue,
    button_second: colors.orange,
    button_third: colors.green,
}