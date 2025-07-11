import styled from "styled-components"
import Button from "../../../components/ui/Button"

type AuthFormProps = React.HTMLAttributes<HTMLFormElement> & {
  fields: React.ReactNode
  submitLabel: string
  isSubmitting?: boolean
}

// styles
const FieldsContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`

const ActionContainer = styled.section`
  margin-top: ${({ theme }) => theme.spacing[6]};
`

const StyledButton = styled(Button)`
  width: 100%;
`

const AuthForm: React.FC<AuthFormProps> = ({
  fields,
  submitLabel,
  isSubmitting,
  ...props
}) => {
  return (
    <form {...props}>
      <FieldsContainer>{fields}</FieldsContainer>
      <ActionContainer>
        <StyledButton type="submit" disabled={isSubmitting}>
          {submitLabel}
        </StyledButton>
      </ActionContainer>
    </form>
  )
}

export default AuthForm
