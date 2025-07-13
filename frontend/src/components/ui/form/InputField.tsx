import { forwardRef } from "react"
import styled from "styled-components"
import {
  Field,
  Input,
  Button,
  type FieldProps,
  type InputProps,
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
  | "className"
  | "invalid"
  | "aria-invalid"
  | "aria-required"
  | "aria-errormessage"
> &
  Pick<FieldProps, "className"> & {
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
  forwardRef<React.ComponentRef<typeof Input>, InputProps>((props, ref) => (
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
/* 
  NOTE: For the Headless UI Input component, passing the component directly to styled() does not result in the correct prop
  types being inferred by styled-components.
  
  We need to explicitly define the component and use the prop types provided by Headless UI, instead of relying on 
  styled-components to infer them.
  
  Additionally, since we need to pass a ref to the Input component, we must use forwardRef as well.
*/

const AdornmentContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding-right: ${({ theme }) => theme.spacing[2]};
`

const StyledButton = styled(Button)`
  ${({ theme, disabled }) =>
    disabled && `opacity: ${theme.opacities.disabled};`}
`

const AdornmentIcon = styled.svg`
  ${({ theme }) => `
    width: ${theme.sizes[6]};
    height: ${theme.sizes[6]};
  `};
`

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
      <Field className={className} disabled={disabled}>
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
