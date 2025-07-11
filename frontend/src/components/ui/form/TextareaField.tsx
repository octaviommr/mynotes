import { forwardRef } from "react"
import styled from "styled-components"
import { Textarea, Field, type TextareaProps } from "@headlessui/react"
import Label from "./Label"
import ErrorMessage from "./ErrorMessage"

type TextareaFieldProps = Omit<
  TextareaProps,
  "invalid" | "aria-invalid" | "aria-required" | "aria-errormessage"
> & {
  label: string
  error?: string
}

// styles
const TextareaContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[1]};
`

const StyledTextarea = styled(
  forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => (
    <Textarea ref={ref} {...props} />
  )),
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
  NOTE: For Headless UI components, passing the component directly to styled() does not result in the correct prop types 
  being inferred by styled-components.
  
  We need to explicitly define the component and use the prop types provided by Headless UI, instead of relying on 
  styled-components to infer them.
  
  Additionally, since we need to pass a ref to the Textarea component, we must use forwardRef as well.
*/

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ name, disabled, required, label, error, ...props }, ref) => {
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
        {error && <ErrorMessage id={errorMessageId} message={error} />}
      </Field>
    )
  },
)

export default TextareaField
