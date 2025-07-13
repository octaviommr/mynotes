import styled from "styled-components"
import { Field, type FieldProps, type CheckboxProps } from "@headlessui/react"
import Label from "./Label"
import Checkbox from "../Checkbox"

type CheckboxFieldProps = Omit<CheckboxProps, "className"> &
  Pick<FieldProps, "className"> & {
    label: string
  }

// styles
const StyledField = styled(Field)`
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

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  className,
  disabled,
  label,
  ...props
}) => {
  return (
    <StyledField className={className} disabled={disabled}>
      <Label label={label} />
      <StyledCheckbox {...props} />
    </StyledField>
  )
}

export default CheckboxField
