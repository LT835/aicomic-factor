// 更新后的字体设置文件

export const arial = {
  variable: "--font-arial",
  className: "font-arial"
}

export const fonts = {
  arial
}

export const fontList = Object.keys(fonts)

export type FontName = keyof typeof fonts

export const defaultFont = "arial" as FontName

export const classNames = Object.values(fonts).map(font => font.className)

export const className = classNames.join(" ")

export type FontClass =
  | "font-arial"
  | "serif"
