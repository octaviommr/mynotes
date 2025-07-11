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
const StyledHeadlessLabel = styled((props: HeadlessLabelProps) => (
  <HeadlessLabel {...props} />
))`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &[data-disabled] {
    opacity: ${({ theme }) => theme.opacities.disabled};
  }
`
/* 
  NOTE: For Headless UI components, passing the component directly to styled() does not result in the correct prop types 
  being inferred by styled-components.
  
  We need to explicitly define the component and use the prop types provided by Headless UI, instead of relying on 
  styled-components to infer them.
*/

const Label: React.FC<LabelProps> = ({ label, required }) => {
  return (
    <StyledHeadlessLabel>{`${label}${required ? " (required)" : ""}`}</StyledHeadlessLabel>
  )
}

export default Label
