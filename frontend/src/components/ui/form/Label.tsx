import styled from "styled-components"
import {
  Label as HeadlessLabel,
  type LabelProps as HeadlessLabelProps,
} from "@headlessui/react"

interface LabelProps {
  label: string
  required?: boolean
}

// styles
const StyledHeadlessLabel = styled(HeadlessLabel)<HeadlessLabelProps>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &[data-disabled] {
    opacity: ${({ theme }) => theme.opacities.disabled};
  }
`
/* 
  NOTE: For Headless UI components, just passing the component to styled() does not result in the correct prop types being
  inferred by styled-components (due to how Headless UI types are defined).

  We need to explicitly set the prop types for the styled component using the types provided by Headless UI.
*/

const Label: React.FC<LabelProps> = ({ label, required }) => {
  return (
    <StyledHeadlessLabel>
      {required ? `${label} (required)` : label}
    </StyledHeadlessLabel>
  )
}

export default Label
