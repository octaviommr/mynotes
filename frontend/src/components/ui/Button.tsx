import { forwardRef } from "react"
import styled from "styled-components"
import {
  Button as HeadlessButton,
  type ButtonProps as HeadlessButtonProps,
} from "@headlessui/react"

type ButtonVariant = "primary" | "secondary" | "error"

type ButtonProps = Omit<
  HeadlessButtonProps,
  "aria-disabled" | "as" | "children"
> & {
  children?: React.ReactNode
  variant?: ButtonVariant
}

// styles
const StyledButton = styled(HeadlessButton)<
  HeadlessButtonProps & {
    $variant?: ButtonVariant
  }
>`
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
  NOTE: For Headless UI components, just passing the component to styled() does not result in the correct prop types being
  inferred by styled-components (due to how Headless UI types are defined).

  We need to explicitly set the prop types for the styled component using the types provided by Headless UI.
*/

const Button = forwardRef<
  React.ComponentRef<typeof HeadlessButton>,
  ButtonProps
>(({ children, variant, ...props }, ref) => {
  return (
    <StyledButton ref={ref} {...props} $variant={variant}>
      {children}
    </StyledButton>
  )
})

export default Button
