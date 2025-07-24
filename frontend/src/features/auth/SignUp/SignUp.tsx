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
import SignUpForm from "./SignUpForm"

const SIGN_UP_TITLE_ID = "sign-up-title"

const SignUp: React.FC = () => {
  const [canRender, setCanRender] = useState(false)
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)

  const navigate = useNavigate()

  // only render the sign up screen if the user is not already logged in
  useEffect(() => {
    if (isLoggedIn) {
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
      <PageTitle id={SIGN_UP_TITLE_ID}>Sign Up</PageTitle>
      <AuthFormContainer>
        <SignUpForm labelElementId={SIGN_UP_TITLE_ID} />
      </AuthFormContainer>
      <AuthPageFooter>
        <p>Already have an account?</p>
        <Link to="/login">Log In</Link>
      </AuthPageFooter>
    </AuthPageContainer>
  )
}

export default SignUp
