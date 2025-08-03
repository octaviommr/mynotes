import styled from "styled-components"
import {
  Checkbox as HeadlessCheckbox,
  type CheckboxProps as HeadlessCheckboxProps,
} from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/16/solid"

type CheckboxProps = Omit<
  HeadlessCheckboxProps,
  | "aria-required"
  | "aria-invalid"
  | "aria-disabled"
  | "aria-errormessage"
  | "as"
  | "children"
>

// styles
const StyledCheckIcon = styled(CheckIcon)`
  width: ${({ theme }) => theme.sizes[4]};
  height: ${({ theme }) => theme.sizes[4]};
  fill: white;
`

const StyledHeadlessCheckbox = styled(HeadlessCheckbox)<HeadlessCheckboxProps>`
  width: ${({ theme }) => theme.sizes[6]};
  height: ${({ theme }) => theme.sizes[6]};
  border-radius: ${({ theme }) => theme.borderRadiuses.md};

  background-color: ${({ theme, checked }) =>
    checked ? theme.colors.secondary : "white"};

  padding: ${({ theme }) => theme.spacing[1]};

  box-shadow: inset 0 0 0 1px
    ${({ theme, checked }) => checked && theme.colors.secondary};

  ${({ theme, disabled }) =>
    disabled &&
    `
      cursor: not-allowed; 
      opacity: ${theme.opacities.disabled};
    `}

  > ${StyledCheckIcon} {
    display: ${({ checked }) => (checked ? "block" : "none")};
  }
`
/* 
  NOTE: For Headless UI components, just passing the component to styled() does not result in the correct prop types being
  inferred by styled-components (due to how Headless UI types are defined).

  We need to explicitly set the prop types for the styled component using the types provided by Headless UI.
*/

const Checkbox: React.FC<CheckboxProps> = (props) => {
  return (
    <StyledHeadlessCheckbox {...props}>
      <StyledCheckIcon />
    </StyledHeadlessCheckbox>
  )
}

export default Checkbox
