import { FC } from "react"
import styled from "styled-components"
import { Field, type FieldProps, type CheckboxProps } from "@headlessui/react"
import Label from "./Label"
import Checkbox from "../Checkbox"

type CheckboxFieldProps = CheckboxProps & { label: string }

// styles
const StyledField = styled((props: FieldProps) => <Field {...props} />)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`
/* 
  NOTE: In the case of the above Headless UI component, simply passing the component into "styled()", thus letting
  styled-components figure out the type of the component props, won't yield the correct type. 
  
  We need to use the type supplied by Headless UI for the component props by explicitly defining the component to be
  rendered.
*/

const StyledCheckbox = styled(Checkbox)`
  &[data-disabled] {
    cursor: not-allowed;
    opacity: ${({ theme }) => theme.opacities.disabled};
  }
`

const CheckboxField: FC<CheckboxFieldProps> = ({
  disabled,
  label,
  ...props
}) => {
  return (
    <StyledField disabled={disabled}>
      <Label>{label}</Label>
      <StyledCheckbox {...props} />
    </StyledField>
  )
}

export default CheckboxField
