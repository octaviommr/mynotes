import { FC, ReactNode, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import type { RootState } from "../../store/store"

interface AuthGuardProps {
  children: ReactNode
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const [canRender, setCanRender] = useState(false)

  const { isLoggedIn } = useSelector((state: RootState) => state.auth)

  const { pathname } = useLocation()
  const navigate = useNavigate()

  // only render the route element if we have an authenticated user
  useEffect(() => {
    if (!isLoggedIn) {
      // redirect to log in screen with the attempted URL so we can redirect back to it later after logging in
      navigate(`/login?attemptedUrl=${pathname}`)

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
