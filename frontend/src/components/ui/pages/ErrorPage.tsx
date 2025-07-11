import styled from "styled-components"
import PageTitle from "./PageTitle"

interface ErrorPageProps {
  title: string
  message: string
  action: React.ReactNode
}

// styles
const ErrorContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]};
`

const ErrorPage: React.FC<ErrorPageProps> = ({ title, message, action }) => {
  return (
    <ErrorContainer>
      <PageTitle>{title}</PageTitle>
      <p>{message}</p>
      {action}
    </ErrorContainer>
  )
}

export default ErrorPage
