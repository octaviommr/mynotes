import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import styled from "styled-components"
import type { RootState } from "../../../store/store"
import UserMenu from "./UserMenu"

// styles
const StyledHeader = styled.header`
  display: flex;
  height: ${({ theme }) => theme.sizes[16]};
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 0 ${({ theme }) => theme.spacing[4]};
`

const StyledLink = styled(Link)`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  color: white;
`

const Header: React.FC = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)

  if (!isLoggedIn) {
    return null
  }

  return (
    <StyledHeader>
      <StyledLink to="/">MyNotes</StyledLink>
      <UserMenu />
    </StyledHeader>
  )
}

export default Header
