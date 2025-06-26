import styled from "styled-components"
import { Label, type LabelProps } from "@headlessui/react"

const StyledLabel = styled((props: LabelProps) => <Label {...props} />)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &[data-disabled] {
    opacity: ${({ theme }) => theme.opacities.disabled};
  }
`
/* 
  NOTE: In the case of the above Headless UI component, simply passing the component into "styled()", thus letting
  styled-components figure out the type of the component props, won't yield the correct type. 
  
  We need to use the type supplied by Headless UI for the component props by explicitly defining the component to be
  rendered.
*/

export default StyledLabel
