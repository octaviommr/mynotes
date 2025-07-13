import { forwardRef } from "react"
import styled from "styled-components"
import {
  Checkbox as HeadlessCheckbox,
  type CheckboxProps,
} from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/16/solid"

// styles
const StyledCheckIcon = styled(CheckIcon)`
  width: ${({ theme }) => theme.sizes[4]};
  height: ${({ theme }) => theme.sizes[4]};
  fill: white;
`

const StyledHeadlessCheckbox = styled(HeadlessCheckbox)`
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

const Checkbox = forwardRef<
  React.ComponentRef<typeof HeadlessCheckbox>,
  CheckboxProps
>((props, ref) => {
  return (
    <StyledHeadlessCheckbox ref={ref} {...props}>
      <StyledCheckIcon />
    </StyledHeadlessCheckbox>
  )
})

export default Checkbox
