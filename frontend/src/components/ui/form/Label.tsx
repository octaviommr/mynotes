import styled from "styled-components"
import { Label as HeadlessLabel } from "@headlessui/react"

interface LabelProps {
  label: string
  required?: boolean
}

// styles
const StyledHeadlessLabel = styled(HeadlessLabel)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &[data-disabled] {
    opacity: ${({ theme }) => theme.opacities.disabled};
  }
`

const Label: React.FC<LabelProps> = ({ label, required }) => {
  return (
    <StyledHeadlessLabel>{`${label}${required ? " (required)" : ""}`}</StyledHeadlessLabel>
  )
}

export default Label
