import { FC } from "react"
import {
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid"
import { MessageSeverity } from "./messageSlice"

interface SeverityAlertProps {
  message: string
}

const ErrorAlert: FC<SeverityAlertProps> = ({ message }) => {
  return (
    <div
      className={"flex max-w-lg items-center gap-2 rounded-md bg-red-100 p-4"}
    >
      <XCircleIcon className="size-6 fill-red-700" />
      <p className="text-sm/6 text-red-700">{message}</p>
    </div>
  )
}

const WarningAlert: FC<SeverityAlertProps> = ({ message }) => {
  return (
    <div
      className={
        "flex max-w-lg items-center gap-2 rounded-md bg-yellow-100 p-4"
      }
    >
      <ExclamationTriangleIcon className="size-6 fill-yellow-700" />
      <p className="text-sm/6 text-yellow-700">{message}</p>
    </div>
  )
}

const InfoAlert: FC<SeverityAlertProps> = ({ message }) => {
  return (
    <div
      className={"flex max-w-lg items-center gap-2 rounded-md bg-gray-100 p-4"}
    >
      <InformationCircleIcon className="size-6 fill-gray-700" />
      <p className="text-sm/6 text-gray-700">{message}</p>
    </div>
  )
}

const SuccessAlert: FC<SeverityAlertProps> = ({ message }) => {
  return (
    <div
      className={"flex max-w-lg items-center gap-2 rounded-md bg-green-100 p-4"}
    >
      <CheckCircleIcon className="size-6 fill-green-700" />
      <p className="text-sm/6 text-green-700">{message}</p>
    </div>
  )
}

interface AlertProps {
  severity: MessageSeverity
  message: string
}

const Alert: FC<AlertProps> = ({ severity, message }) => {
  return (
    <>
      {severity === "error" && <ErrorAlert message={message} />}
      {severity === "warning" && <WarningAlert message={message} />}
      {severity === "info" && <InfoAlert message={message} />}
      {severity === "success" && <SuccessAlert message={message} />}
    </>
  )
}

export default Alert
