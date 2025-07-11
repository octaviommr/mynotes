import { forwardRef } from "react"
import type { InputProps } from "@headlessui/react"
import InputField from "./InputField"

type TextFieldProps = Omit<
  InputProps,
  "type" | "invalid" | "aria-invalid" | "aria-required" | "aria-errormessage"
> & {
  label: string
  error?: string
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  return <InputField ref={ref} {...props} />
})

export default TextField
