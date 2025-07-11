import ErrorPage from "../components/ui/pages/ErrorPage"
import Button from "../components/ui/Button"

interface GlobalErrorProps {
  onRetry: () => void
}

const GlobalError: React.FC<GlobalErrorProps> = ({ onRetry }) => {
  return (
    <ErrorPage
      title="Oh no..."
      message="Something went wrong."
      action={<Button onClick={() => onRetry()}>Try Again</Button>}
    />
  )
}

export default GlobalError
