import { FC } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/16/solid"
import { AppDispatch } from "../../store"
import { logOut as runLogOutThunk, getUserInitials } from "../auth/authSlice"

const UserMenu: FC = () => {
  const userInitials = useSelector(getUserInitials)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const logOut = () => {
    dispatch(runLogOutThunk())

    // redirect to login screen
    navigate("/login")
  }

  return (
    <Menu>
      <MenuButton className="inline-flex size-10 items-center justify-center rounded-full bg-gray-700 font-medium text-white ring-2 ring-white">
        {userInitials}
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="w-52 origin-top-right rounded-xl border border-gray-300 bg-white p-1 text-sm/6"
      >
        <MenuItem>
          <button
            onClick={() => logOut()}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-gray-100"
          >
            <ArrowLeftEndOnRectangleIcon className="size-4" />
            Log Out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}

export default UserMenu
