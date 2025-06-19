import styled from "styled-components"

const FormContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[10]};

  > form {
    margin: 0 auto;
    width: 100%;
    max-width: ${({ theme }) => theme.sizes.sm};

    > section:first-child {
      display: flex;
      flex-direction: column;
      gap: ${({ theme }) => theme.spacing[6]};
      margin-bottom: ${({ theme }) => theme.spacing[8]};
    }
  }

  > footer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`

export default FormContainer
