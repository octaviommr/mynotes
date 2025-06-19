import styled from "styled-components"
import { Button, type ButtonProps } from "@headlessui/react"

type ButtonVariant = "primary" | "secondary" | "error"

const StyledButton = styled((props: ButtonProps) => <Button {...props} />)<{
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
/* 
  NOTE: In the case of the above Headless UI component, simply passing the component into "styled()", thus letting
  styled-components figure out the type of the component props, won't yield the correct type. 
  
  We need to use the type supplied by Headless UI for the component props by explicitly defining the component to be
  rendered.
*/

export default StyledButton
