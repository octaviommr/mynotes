import styled from "styled-components"
import {
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid"
import type { MessageSeverity } from "./messageSlice"

interface AlertProps {
  severity: MessageSeverity
  message: string
}

// styles
const SeverityIcon = styled.svg`
  width: ${({ theme }) => theme.sizes[6]};
  height: ${({ theme }) => theme.sizes[6]};
`

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const AlertContainer = styled.div<{
  $severity: MessageSeverity
}>`
  display: flex;
  max-width: ${({ theme }) => theme.sizes.lg};
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadiuses.md};
  padding: ${({ theme }) => theme.spacing[4]};

  background-color: ${({ theme, $severity }) =>
    theme.colors[`${$severity}-light`]};

  > ${SeverityIcon} {
    fill: ${({ theme, $severity }) => theme.colors[$severity]};
  }

  > ${Message} {
    color: ${({ theme, $severity }) => theme.colors[$severity]};
  }
`

const Alert: React.FC<AlertProps> = ({ severity, message }) => {
  const getSeverityIcon = (severity: MessageSeverity) => {
    switch (severity) {
      case "error":
        return XCircleIcon
      case "warning":
        return ExclamationTriangleIcon
      case "info":
        return InformationCircleIcon
      case "success":
        return CheckCircleIcon
    }
  }

  return (
    <AlertContainer $severity={severity} role="alert">
      <SeverityIcon as={getSeverityIcon(severity)} />
      <Message>{message}</Message>
    </AlertContainer>
  )
}

export default Alert
