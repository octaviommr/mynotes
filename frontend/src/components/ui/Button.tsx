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
  NOTE: For Headless UI components, passing the component directly to styled() does not result in the correct prop types 
  being inferred by styled-components.
  
  We need to explicitly define the component and use the prop types provided by Headless UI, instead of relying on 
  styled-components to infer them.
*/

export default StyledButton
