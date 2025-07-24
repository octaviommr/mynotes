import { forwardRef } from "react"
import styled from "styled-components"
import {
  Field,
  Checkbox as HeadlessCheckbox,
  type FieldProps,
  type CheckboxProps,
} from "@headlessui/react"
import Label from "./Label"
import { makeLabel } from "./utils/makeLabel"
import Checkbox from "../Checkbox"

type CheckboxFieldProps = Omit<CheckboxProps, "className" | "aria-disabled"> &
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

const CheckboxField = forwardRef<
  React.ComponentRef<typeof HeadlessCheckbox>,
  CheckboxFieldProps
>(({ className, disabled, label, ...props }, ref) => {
  return (
    <StyledField className={className} disabled={disabled}>
      <Label>{makeLabel(label)}</Label>
      <StyledCheckbox ref={ref} {...props} />
    </StyledField>
  )
})

export default CheckboxField
