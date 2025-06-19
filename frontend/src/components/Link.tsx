import styled from "styled-components"
import { Link } from "react-router-dom"

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

export default StyledLink
