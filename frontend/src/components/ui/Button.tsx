import styled from "styled-components"
import { Button } from "@headlessui/react"

type ButtonVariant = "primary" | "secondary" | "error"

const StyledButton = styled(Button)<{
  $variant?: ButtonVariant
}>`
  border-radius: ${({ theme }) => theme.borderRadiuses.md};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};

  ${({ $variant }) =>
    $variant === "secondary" ? `border: 1px solid;` : "color: white;"};

  background-color: ${({ theme, $variant }) => {
    switch ($variant) {
      case "secondary":
        return "white"
      case "error":
        return theme.colors.error
      default:
        return theme.colors.primary
    }
  }};

  ${({ theme, disabled }) =>
    disabled && `opacity: ${theme.opacities.disabled};`};
`

export default StyledButton
