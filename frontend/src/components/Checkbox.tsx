import { FC } from "react"
import styled from "styled-components"
import {
  Checkbox as HeadlessCheckbox,
  type CheckboxProps,
} from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/16/solid"

// styles
const StyledCheckIcon = styled(CheckIcon)``
/*
  NOTE: This is needed because "CheckIcon" is not a styled component but we need to reference it in "StyledCheckbox", since
  that's the context where we define the styles for the checkbox icon
*/

const StyledCheckbox = styled((props: CheckboxProps) => (
  <HeadlessCheckbox {...props} />
))`
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
    width: ${({ theme }) => theme.sizes[4]};
    height: ${({ theme }) => theme.sizes[4]};
    fill: white;
  }
`
/* 
  NOTE: In the case of the above Headless UI component, simply passing the component into "styled()", thus letting
  styled-components figure out the type of the component props, won't yield the correct type. 
  
  We need to use the type supplied by Headless UI for the component props by explicitly defining the component to be
  rendered.
*/

const Checkbox: FC<CheckboxProps> = (props) => {
  return (
    <StyledCheckbox {...props}>
      <StyledCheckIcon />
    </StyledCheckbox>
  )
}

export default Checkbox
