import styled from "styled-components"
import { Field, type FieldProps, type CheckboxProps } from "@headlessui/react"
import Label from "./Label"
import Checkbox from "../Checkbox"

type CheckboxFieldProps = Omit<
  CheckboxProps,
  | "name"
  | "value"
  | "defaultValue"
  | "defaultChecked"
  | "aria-required"
  | "aria-invalid"
  | "aria-disabled"
  | "aria-errormessage"
  | "as"
  | "children"
> & {
  name: string
  label: string
}

// styles
const StyledField = styled(Field)<FieldProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`

const StyledCheckbox = styled(Checkbox)`
  &[data-disabled] {
    cursor: not-allowed;
    opacity: ${({ theme }) => theme.opacities.disabled};
  }
`
/* 
  NOTE: For Headless UI components, just passing the component to styled() does not result in the correct prop types being
  inferred by styled-components (due to how Headless UI types are defined).

  We need to explicitly set the prop types for the styled component using the types provided by Headless UI.
*/

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  disabled,
  label,
  ...props
}) => {
  return (
    <StyledField disabled={disabled}>
      <Label label={label} />
      <StyledCheckbox {...props} />
    </StyledField>
  )
}

export default CheckboxField
