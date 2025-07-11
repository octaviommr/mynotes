import { forwardRef } from "react"
import styled from "styled-components"
import {
  Field,
  Input,
  Button,
  type InputProps,
  type ButtonProps,
} from "@headlessui/react"
import type { Icon } from "../../../types/Icon"
import Label from "./Label"
import ErrorMessage from "./ErrorMessage"

interface InputAdornment {
  icon: Icon
  onClick?: () => void
}

type InputFieldProps = Omit<
  InputProps,
  "invalid" | "aria-invalid" | "aria-required" | "aria-errormessage"
> & {
  label: string
  error?: string
  adornment?: InputAdornment
}

// styles
const InputContainer = styled.div`
  position: relative;
  margin-top: ${({ theme }) => theme.spacing[1]};
`

const StyledInput = styled(
  forwardRef<HTMLInputElement, InputProps>((props, ref) => (
    <Input ref={ref} {...props} />
  )),
)<{ $hasAdornment?: boolean }>`
  display: block;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadiuses.lg};
  border: 1px solid ${({ theme, invalid }) => invalid && theme.colors.error};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  padding-right: ${({ theme, $hasAdornment }) =>
    $hasAdornment && theme.spacing[10]};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &[data-disabled] {
    opacity: ${({ theme }) => theme.opacities.disabled};
  }
`

const AdornmentContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding-right: ${({ theme }) => theme.spacing[2]};
`

const StyledButton = styled((props: ButtonProps) => <Button {...props} />)`
  ${({ theme, disabled }) =>
    disabled && `opacity: ${theme.opacities.disabled};`}
`

const AdornmentIcon = styled.svg`
  ${({ theme }) => `
    width: ${theme.sizes[6]};
    height: ${theme.sizes[6]};
  `};
`
/* 
  NOTE: For Headless UI components, passing the component directly to styled() does not result in the correct prop types 
  being inferred by styled-components.
  
  We need to explicitly define the component and use the prop types provided by Headless UI, instead of relying on 
  styled-components to infer them.
  
  Additionally, since we need to pass a ref to the Input component, we must use forwardRef as well.
*/

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ name, disabled, required, label, error, adornment, ...props }, ref) => {
    const errorMessageId = `${name}-error-message`

    return (
      <Field disabled={disabled}>
        <Label label={label} required={required} />
        <InputContainer>
          <StyledInput
            ref={ref}
            name={name}
            invalid={!!error}
            aria-required={required}
            aria-errormessage={errorMessageId}
            $hasAdornment={!!adornment}
            {...props}
          />
          {adornment && (
            <AdornmentContainer>
              {adornment.onClick ? (
                <StyledButton
                  onClick={() => adornment.onClick!()}
                  disabled={disabled}
                >
                  <AdornmentIcon as={adornment.icon} />
                </StyledButton>
              ) : (
                <AdornmentIcon as={adornment.icon} />
              )}
            </AdornmentContainer>
          )}
        </InputContainer>
        {error && <ErrorMessage id={errorMessageId} message={error} />}
      </Field>
    )
  },
)

export default InputField
