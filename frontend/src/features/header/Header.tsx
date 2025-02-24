import { FC } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { RootState } from "../../store"
import UserMenu from "./UserMenu"

const Header: FC = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="flex h-16 items-center justify-between bg-sky-700 px-4">
      <Link to="/" className="text-bold text-2xl text-white">
        MyNotes
      </Link>
      <UserMenu />
    </div>
  )
}

export default Header
