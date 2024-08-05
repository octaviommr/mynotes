import { FC, ReactNode, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { RootState, AppDispatch } from "../../store"
import { setAttemptedURL } from "./authSlice"

interface AuthGuardProps {
  children: ReactNode
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const [canRender, setCanRender] = useState(false)

  const { isLoggedIn } = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch<AppDispatch>()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // only render the route element if we have an authenticated user
  useEffect(() => {
    if (!isLoggedIn) {
      // save the attempted URL so we can redirect back to it later after login
      dispatch(setAttemptedURL(pathname))

      // redirect to login screen
      navigate("/login")

      return
    }

    setCanRender(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!canRender) {
    return null
  }

  return <>{children}</>
}

export default AuthGuard
