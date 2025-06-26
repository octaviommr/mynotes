import styled from "styled-components"

const ErrorContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > p {
    margin: ${({ theme }) => `${theme.spacing[2]} 0 ${theme.spacing[10]}`};
  }
`

export default ErrorContainer
