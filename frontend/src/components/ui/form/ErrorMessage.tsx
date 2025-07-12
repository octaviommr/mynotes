import styled from "styled-components"

const ErrorMessage = styled.p.attrs({
  role: "alert",
})`
  margin-top: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
`

export default ErrorMessage
