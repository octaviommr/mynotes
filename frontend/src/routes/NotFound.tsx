import ErrorPage from "../components/ui/pages/ErrorPage"
import Link from "../components/ui/Link"

const NotFound: React.FC = () => {
  return (
    <ErrorPage
      title="Ooops..."
      message="Page not found."
      action={<Link to="/">Back to Homepage</Link>}
    />
  )
}

export default NotFound
