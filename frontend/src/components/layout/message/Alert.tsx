import { FC } from "react"
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
const AlertIcon = styled.svg`
  width: ${({ theme }) => theme.sizes[6]};
  height: ${({ theme }) => theme.sizes[6]};
`

const AlertMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const AlertContainer = styled.div.attrs<{
  $severity: MessageSeverity
}>({ role: "alert" })`
  display: flex;
  max-width: ${({ theme }) => theme.sizes.lg};
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadiuses.md};
  padding: ${({ theme }) => theme.spacing[4]};

  background-color: ${({ theme, $severity }) =>
    theme.colors[`${$severity}-light`]};

  > ${AlertIcon} {
    fill: ${({ theme, $severity }) => theme.colors[$severity]};
  }

  > ${AlertMessage} {
    color: ${({ theme, $severity }) => theme.colors[$severity]};
  }
`

const Alert: FC<AlertProps> = ({ severity, message }) => {
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
    <AlertContainer $severity={severity}>
      <AlertIcon as={getSeverityIcon(severity)} />
      <AlertMessage>{message}</AlertMessage>
    </AlertContainer>
  )
}

export default Alert
