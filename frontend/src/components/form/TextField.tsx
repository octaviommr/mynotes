import { forwardRef } from "react"
import styled from "styled-components"
import { Input, Field, type InputProps } from "@headlessui/react"
import Label from "./Label"
import ErrorMessage from "./ErrorMessage"

type TextFieldProps = Omit<
  InputProps,
  "type" | "invalid" | "aria-invalid" | "aria-required" | "aria-errormessage"
> & {
  label: string
  error?: string
}

// styles
const StyledInput = styled(
  forwardRef<HTMLInputElement, InputProps>((props, ref) => (
    <Input ref={ref} {...props} />
  )),
)`
  margin-top: ${({ theme }) => theme.spacing[1]};
  display: block;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadiuses.lg};
  border: 1px solid ${({ theme, invalid }) => invalid && theme.colors.error};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &[data-disabled] {
    opacity: ${({ theme }) => theme.opacities.disabled};
  }
`
/* 
  NOTE: In the case of the above Headless UI component, simply passing the component into "styled()", thus letting
  styled-components figure out the type of the component props, won't yield the correct type.
  
  We need to use the type supplied by Headless UI for the component props by explicitly defining the component to be
  rendered. And because we need to pass a ref, we need to use "forwardRef" as well.
*/

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ disabled, required, label, error, ...props }, ref) => {
    return (
      <Field disabled={disabled}>
        <Label>{`${label}${required ? " (required)" : ""}`}</Label>
        <StyledInput
          ref={ref}
          invalid={!!error}
          aria-required={required}
          aria-errormessage={`${props.name}-error-message`}
          {...props}
        />
        {error && (
          <ErrorMessage id={`${props.name}-error-message`}>
            {error}
          </ErrorMessage>
        )}
      </Field>
    )
  },
)

export default TextField
