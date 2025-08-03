import { forwardRef } from "react"
import styled from "styled-components"
import { Field, Textarea, type TextareaProps } from "@headlessui/react"
import Label from "./Label"
import ErrorMessage from "./ErrorMessage"

type TextareaFieldProps = Omit<
  TextareaProps,
  | "name"
  | "value"
  | "defaultValue"
  | "invalid"
  | "aria-required"
  | "aria-invalid"
  | "aria-disabled"
  | "aria-errormessage"
  | "as"
  | "children"
> & {
  name: string
  label: string
  error?: string
}

// styles
const TextareaContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[1]};
`

const StyledTextarea = styled(Textarea)<TextareaProps>`
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
  NOTE: For Headless UI components, just passing the component to styled() does not result in the correct prop types being
  inferred by styled-components (due to how Headless UI types are defined).

  We need to explicitly set the prop types for the styled component using the types provided by Headless UI.
*/

const TextareaField = forwardRef<
  React.ComponentRef<typeof Textarea>,
  TextareaFieldProps
>(({ className, name, disabled, required, label, error, ...props }, ref) => {
  const errorMessageId = `${name}-error-message`

  return (
    <Field disabled={disabled}>
      <Label label={label} required={required} />
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
