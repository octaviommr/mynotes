import styled from "styled-components"

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
`

export default PageTitle
