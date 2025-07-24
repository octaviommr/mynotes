import styled from "styled-components"
import { Label } from "@headlessui/react"

const StyledLabel = styled(Label)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &[data-disabled] {
    opacity: ${({ theme }) => theme.opacities.disabled};
  }
`

export default StyledLabel
