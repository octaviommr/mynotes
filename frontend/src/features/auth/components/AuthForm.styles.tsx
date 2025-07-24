import styled from "styled-components"
import Button from "../../../components/ui/Button"

export const AuthFormFieldsContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`

export const AuthFormActionsContainer = styled.section`
  margin-top: ${({ theme }) => theme.spacing[6]};
`

export const AuthFormSubmitButton = styled(Button)`
  width: 100%;
`
