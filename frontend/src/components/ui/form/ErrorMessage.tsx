import styled from "styled-components"

interface ErrorMessageProps {
  id: string
  message: string
}

// styles
const StyledErrorMessage = styled.p.attrs({
  role: "alert",
})`
  margin-top: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
`

const ErrorMessage: React.FC<ErrorMessageProps> = ({ id, message }) => {
  return <StyledErrorMessage id={id}>{message}</StyledErrorMessage>
}

export default ErrorMessage
