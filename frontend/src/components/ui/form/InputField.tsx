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
  adornment?: InputAdornment
}

// styles
const InputContainer = styled.div`
  position: relative;
  margin-top: ${({ theme }) => theme.spacing[1]};
`

const StyledInput = styled(Input)<InputProps & { $hasAdornment?: boolean }>`
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

const StyledButton = styled(Button)<ButtonProps>`
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
  NOTE: For Headless UI components, just passing the component to styled() does not result in the correct prop types being
  inferred by styled-components (due to how Headless UI types are defined).

  We need to explicitly set the prop types for the styled component using the types provided by Headless UI.
*/

const InputField = forwardRef<
  React.ComponentRef<typeof Input>,
  InputFieldProps
>(
  (
    { className, name, disabled, required, label, error, adornment, ...props },
    ref,
  ) => {
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
        {error && <ErrorMessage id={errorMessageId}>{error}</ErrorMessage>}
      </Field>
    )
  },
)

export default InputField
