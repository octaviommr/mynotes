import { FC } from "react"
import ErrorContainer from "./ErrorContainer"
import PageTitle from "../../components/PageTitle"
import Link from "../../components/Link"

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
