import styled from "styled-components"

export const NotePageContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[10]};
`

export const NoteFormContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.sm};
`
