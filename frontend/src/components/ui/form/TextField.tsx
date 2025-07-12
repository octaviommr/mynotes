import { forwardRef } from "react"
import type { FieldProps, InputProps } from "@headlessui/react"
import InputField from "./InputField"

type TextFieldProps = Omit<
  InputProps,
  | "className"
  | "type"
  | "invalid"
  | "aria-invalid"
  | "aria-required"
  | "aria-errormessage"
> &
  Pick<FieldProps, "className"> & {
    label: string
    error?: string
  }

const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  return <InputField ref={ref} {...props} />
})

export default TextField
