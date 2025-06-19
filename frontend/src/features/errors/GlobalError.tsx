import { FC } from "react"
import ErrorContainer from "./ErrorContainer"
import PageTitle from "../../components/PageTitle"
import Button from "../../components/Button"

interface GlobalErrorProps {
  onRetry: () => void
}

const GlobalError: FC<GlobalErrorProps> = ({ onRetry }) => {
  return (
    <ErrorContainer>
      <PageTitle>Ooops...</PageTitle>
      <p>Something went wrong!</p>
      <Button onClick={() => onRetry()}>Try Again</Button>
    </ErrorContainer>
  )
}

export default GlobalError
