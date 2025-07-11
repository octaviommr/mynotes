import styled from "styled-components"

export const AuthPageContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[10]};
`

export const AuthFormContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.sm};
`

export const AuthPageFooter = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`
