import { DefaultTheme } from "styled-components"

const spacing = {
  1: "0.25rem" /* 4px */,
  2: "0.5rem" /* 8px */,
  3: "0.75rem" /* 12px */,
  4: "1rem" /* 16px */,
  6: "1.5rem" /* 24px */,
  8: "2rem" /* 32px */,
  10: "2.5rem" /* 40px */,
}

const sizes = {
  4: "1rem" /* 16px */,
  6: "1.5rem" /* 24px */,
  10: "2.5rem" /* 40px */,
  16: "4rem" /* 64px */,
  52: "13rem" /* 208px */,
  56: "14rem" /* 224px */,
  72: "18rem" /* 288px */,
  sm: "24rem" /* 384px */,
  lg: "32rem" /* 512px */,
}

const borderRadiuses = {
  md: "0.375rem" /* 6px */,
  lg: "0.5rem" /* 8px */,
  xl: "0.75rem" /* 12px */,
  full: "9999px",
}

const fontSizes = {
  xs: "0.75rem" /* 12px */,
  sm: "0.875rem" /* 14px */,
  lg: "1.125rem" /* 18px */,
  "2xl": "1.5rem" /* 24px */,
  "3xl": "1.875rem" /* 30px */,
}

const fontWeights = {
  medium: "500",
  semibold: "600",
  bold: "700",
}

const colors = {
  primary: "#0369a1",
  "primary-light": "#e0f2fe",
  secondary: "#a21caf",
  "secondary-light": "#fae8ff",
  error: "#b91c1c",
  "error-light": "#fee2e2",
  warning: "#a16207",
  "warning-light": "#fef9c3",
  info: "#374151",
  "info-light": "#f3f4f6",
  success: "#15803d",
  "success-light": "#dcfce7",
}

const opacities = {
  disabled: "0.5",
}

const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
}

const theme: DefaultTheme = {
  spacing,
  sizes,
  borderRadiuses,
  fontSizes,
  fontWeights,
  colors,
  opacities,
  breakpoints,
}

export default theme
