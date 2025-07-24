import { forwardRef } from "react"
import styled from "styled-components"
import {
  Field,
  Textarea,
  type FieldProps,
  type TextareaProps,
} from "@headlessui/react"
import Label from "./Label"
import { makeLabel } from "./utils/makeLabel"
import ErrorMessage from "./ErrorMessage"

type TextareaFieldProps = Omit<
  TextareaProps,
  | "className"
  | "invalid"
  | "aria-required"
  | "aria-invalid"
  | "aria-disabled"
  | "aria-errormessage"
> &
  Pick<FieldProps, "className"> & {
    label: string
    error?: string
  }

// styles
const TextareaContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[1]};
`

const StyledTextarea = styled(
  forwardRef<React.ComponentRef<typeof Textarea>, TextareaProps>(
    (props, ref) => <Textarea ref={ref} {...props} />,
  ),
)`
  display: block;
  width: 100%;
  resize: none;
  border-radius: ${({ theme }) => theme.borderRadiuses.lg};
  border: 1px solid ${({ theme, invalid }) => invalid && theme.colors.error};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &[data-disabled] {
    opacity: ${({ theme }) => theme.opacities.disabled};
  }
`
/* 
  NOTE: For the Headless UI Textarea component, passing the component directly to styled() does not result in the correct
  prop types being inferred by styled-components.
  
  We need to explicitly define the component and use the prop types provided by Headless UI, instead of relying on 
  styled-components to infer them.
  
  Additionally, since we need to pass a ref to the Textarea component, we must use forwardRef as well.
*/

const TextareaField = forwardRef<
  React.ComponentRef<typeof Textarea>,
  TextareaFieldProps
>(({ className, name, disabled, required, label, error, ...props }, ref) => {
  const errorMessageId = `${name}-error-message`

  return (
    <Field className={className} disabled={disabled}>
      <Label>{makeLabel(label, required)}</Label>
      <TextareaContainer>
        <StyledTextarea
          ref={ref}
          name={name}
          invalid={!!error}
          aria-required={required}
          aria-errormessage={errorMessageId}
          {...props}
        />
      </TextareaContainer>
      {error && <ErrorMessage id={errorMessageId}>{error}</ErrorMessage>}
    </Field>
  )
})

export default TextareaField
