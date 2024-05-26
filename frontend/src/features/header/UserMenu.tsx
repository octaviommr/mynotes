import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/solid"
import { AppDispatch } from "../../store"
import { logout as logoutAction, getUserInitials } from "../auth/authSlice"

const UserMenu = () => {
  const userInitials = useSelector(getUserInitials)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const logout = async () => {
    dispatch(logoutAction())

    // redirect back to login screen
    navigate("/login")
  }

  return (
    <Menu>
      <MenuButton className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 font-medium text-white ring-2 ring-white">
        {userInitials}
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="w-52 origin-top-right rounded-xl border border-gray-300 bg-white p-1 text-sm/6"
      >
        <MenuItem>
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-gray-100"
          >
            <ArrowLeftEndOnRectangleIcon className="size-4" />
            Log out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}

export default UserMenu
