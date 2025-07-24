import { forwardRef } from "react"
import { Input, type FieldProps, type InputProps } from "@headlessui/react"
import InputField from "./InputField"

type TextFieldProps = Omit<
  InputProps,
  | "className"
  | "type"
  | "invalid"
  | "aria-required"
  | "aria-invalid"
  | "aria-disabled"
  | "aria-errormessage"
> &
  Pick<FieldProps, "className"> & {
    label: string
    error?: string
  }

const TextField = forwardRef<React.ComponentRef<typeof Input>, TextFieldProps>(
  (props, ref) => {
    return <InputField ref={ref} {...props} />
  },
)

export default TextField
