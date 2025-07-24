import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/16/solid"
import type { AppDispatch } from "../../../store/store"
import {
  logOut as runLogOutThunk,
  getUserInitials,
} from "../../../features/auth/authSlice"

// styles
const StyledMenuButton = styled(MenuButton)`
  display: inline-flex;
  width: ${({ theme }) => theme.sizes[10]};
  height: ${({ theme }) => theme.sizes[10]};
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadiuses.full};
  background-color: ${({ theme }) => theme.colors.secondary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: white;
  box-shadow: inset 0 0 0 2px white;
`

const StyledMenuItems = styled(MenuItems)`
  width: ${({ theme }) => theme.sizes[52]};
  transform-origin: top right;
  border-radius: ${({ theme }) => theme.borderRadiuses.xl};
  border: 1px solid;
  background-color: white;
  padding: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const LogOutButton = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadiuses.lg};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};

  &:hover {
    background-color: ${({ theme }) => theme.colors["primary-light"]};
  }
`

const StyledArrowLeftEndOnRectangleIcon = styled(ArrowLeftEndOnRectangleIcon)`
  width: ${({ theme }) => theme.sizes[4]};
  height: ${({ theme }) => theme.sizes[4]};
`

const UserMenu: React.FC = () => {
  const userInitials = useSelector(getUserInitials)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const logOut = () => {
    dispatch(runLogOutThunk())

    // redirect to log in screen
    navigate("/login")
  }

  return (
    <Menu>
      <StyledMenuButton>{userInitials}</StyledMenuButton>
      <StyledMenuItems anchor="bottom end">
        <MenuItem>
          <LogOutButton onClick={() => logOut()}>
            <StyledArrowLeftEndOnRectangleIcon />
            Log Out
          </LogOutButton>
        </MenuItem>
      </StyledMenuItems>
    </Menu>
  )
}

export default UserMenu
