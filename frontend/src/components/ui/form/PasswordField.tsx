import { forwardRef, useState } from "react"
import styled from "styled-components"
import {
  Input,
  Field,
  Button,
  type InputProps,
  type ButtonProps,
} from "@headlessui/react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"
import Label from "./Label"
import ErrorMessage from "./ErrorMessage"

type PasswordFieldProps = Omit<
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
  display: block;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadiuses.lg};
  border: 1px solid ${({ theme, invalid }) => invalid && theme.colors.error};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  padding-right: ${({ theme }) => theme.spacing[10]};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &[data-disabled] {
    opacity: ${({ theme }) => theme.opacities.disabled};
  }
`

const StyledButton = styled((props: ButtonProps) => <Button {...props} />)`
  ${({ theme, disabled }) =>
    disabled && `opacity: ${theme.opacities.disabled};`}
`
/* 
  NOTE: In the case of the above Headless UI components, simply passing the component into "styled()", thus letting
  styled-components figure out the type of the component props, won't yield the correct type.
  
  We need to use the type supplied by Headless UI for the component props by explicitly defining the components to be
  rendered. And because we need to pass a ref to the "Input" component, we need to use "forwardRef" as well in that case.
*/

const InputContainer = styled.div`
  position: relative;
  margin-top: ${({ theme }) => theme.spacing[1]};

  > div {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding-right: ${({ theme }) => theme.spacing[2]};
  }
`

const PasswordVisibilityIcon = styled.svg`
  ${({ theme }) => `
    width: ${theme.sizes[6]};
    height: ${theme.sizes[6]};
  `};
`

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ disabled, required, label, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <Field disabled={disabled}>
        <Label>{`${label}${required ? " (required)" : ""}`}</Label>
        <InputContainer>
          <StyledInput
            ref={ref}
            type={showPassword ? "text" : "password"}
            invalid={!!error}
            aria-required={required}
            aria-errormessage={`${props.name}-error-message`}
            {...props}
          />
          <div>
            <StyledButton
              onClick={() => setShowPassword((previousValue) => !previousValue)}
              disabled={disabled}
            >
              <PasswordVisibilityIcon
                as={showPassword ? EyeSlashIcon : EyeIcon}
              />
            </StyledButton>
          </div>
        </InputContainer>
        {error && (
          <ErrorMessage id={`${props.name}-error-message`}>
            {error}
          </ErrorMessage>
        )}
      </Field>
    )
  },
)

export default PasswordField
