import { forwardRef } from "react"
import { Input, type InputProps } from "@headlessui/react"
import InputField from "./InputField"

type TextFieldProps = Omit<
  InputProps,
  | "name"
  | "type"
  | "value"
  | "defaultValue"
  | "invalid"
  | "aria-required"
  | "aria-invalid"
  | "aria-disabled"
  | "aria-errormessage"
  | "as"
  | "children"
> & {
  name: string
  label: string
  error?: string
}

const TextField = forwardRef<React.ComponentRef<typeof Input>, TextFieldProps>(
  (props, ref) => {
    return <InputField ref={ref} {...props} />
  },
)

export default TextField
