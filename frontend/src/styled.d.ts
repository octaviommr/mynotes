import "styled-components"

interface Spacing {
  1: string
  2: string
  3: string
  4: string
  6: string
  8: string
  10: string
}

interface Sizes {
  4: string
  6: string
  10: string
  16: string
  52: string
  56: string
  72: string
  sm: string
  lg: string
}

interface BorderRadiuses {
  md: string
  lg: string
  xl: string
  full: string
}

interface FontSizes {
  xs: string
  sm: string
  lg: string
  "2xl": string
  "3xl": string
}

interface FontWeights {
  medium: string
  semibold: string
  bold: string
}

interface Colors {
  primary: string
  "primary-light": string
  secondary: string
  "secondary-light": string
  error: string
  "error-light": string
  warning: string
  "warning-light": string
  info: string
  "info-light": string
  success: string
  "success-light": string
}

interface Opacities {
  disabled: string
}

interface Breakpoints {
  sm: string
  md: string
  lg: string
}

declare module "styled-components" {
  export interface DefaultTheme {
    spacing: Spacing
    sizes: Sizes
    borderRadiuses: BorderRadiuses
    fontSizes: FontSizes
    fontWeights: FontWeights
    colors: Colors
    opacities: Opacities
    breakpoints: Breakpoints
  }
}
