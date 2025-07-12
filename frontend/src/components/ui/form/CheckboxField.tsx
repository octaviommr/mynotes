import styled from "styled-components"
import { Field, type FieldProps, type CheckboxProps } from "@headlessui/react"
import Label from "./Label"
import Checkbox from "../Checkbox"

type CheckboxFieldProps = Omit<CheckboxProps, "className"> &
  Pick<FieldProps, "className"> & {
    label: string
  }

// styles
const StyledField = styled((props: FieldProps) => <Field {...props} />)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`
/* 
  NOTE: For Headless UI components, passing the component directly to styled() does not result in the correct prop types 
  being inferred by styled-components.
  
  We need to explicitly define the component and use the prop types provided by Headless UI, instead of relying on 
  styled-components to infer them.
*/

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
