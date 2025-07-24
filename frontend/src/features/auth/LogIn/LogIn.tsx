import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { RootState } from "../../../store/store"
import PageTitle from "../../../components/ui/pages/PageTitle"
import Link from "../../../components/ui/Link"
import {
  AuthPageContainer,
  AuthFormContainer,
  AuthPageFooter,
} from "../components/AuthPage.styles"
import LogInForm from "./LogInForm"

const LOG_IN_TITLE_ID = "log-in-title"

const LogIn: React.FC = () => {
  const [canRender, setCanRender] = useState(false)
  const authState = useSelector((state: RootState) => state.auth)

  const navigate = useNavigate()

  // only render the log in screen if the user is not already logged in
  useEffect(() => {
    if (authState.isLoggedIn) {
      // redirect to homepage
      navigate("/")

      return
    }

    setCanRender(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!canRender) {
    return null
  }

  return (
    <AuthPageContainer>
      <PageTitle id={LOG_IN_TITLE_ID}>Log In</PageTitle>
      <AuthFormContainer>
        <LogInForm labelElementId={LOG_IN_TITLE_ID} />
      </AuthFormContainer>
      <AuthPageFooter>
        <p>Don't have an account yet?</p>
        <Link to="/signup">Sign Up</Link>
      </AuthPageFooter>
    </AuthPageContainer>
  )
}

export default LogIn
