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
  }
`
/* 
  NOTE: For Headless UI components, passing the component directly to styled() does not result in the correct prop types 
  being inferred by styled-components.
  
  We need to explicitly define the component and use the prop types provided by Headless UI, instead of relying on 
  styled-components to infer them.
*/

const Checkbox: React.FC<CheckboxProps> = (props) => {
  return (
    <StyledCheckbox {...props}>
      <StyledCheckIcon />
    </StyledCheckbox>
  )
}

export default Checkbox
