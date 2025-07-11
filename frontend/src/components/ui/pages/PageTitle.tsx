import styled from "styled-components"

interface PageTitleProps {
  id?: string
  children: React.ReactNode
}

// styles
const Heading = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
`

const PageTitle: React.FC<PageTitleProps> = ({ id, children }) => {
  return <Heading id={id}>{children}</Heading>
}

export default PageTitle
