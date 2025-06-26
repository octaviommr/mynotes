import { FC } from "react"
import ErrorContainer from "../components/ui/containers/ErrorContainer"
import PageTitle from "../components/ui/PageTitle"
import Link from "../components/ui/Link"

const NotFound: FC = () => {
  return (
    <ErrorContainer>
      <PageTitle>Ooops...</PageTitle>
      <p>Page not found!</p>
      <Link to="/">Back to Homepage</Link>
    </ErrorContainer>
  )
}

export default NotFound
