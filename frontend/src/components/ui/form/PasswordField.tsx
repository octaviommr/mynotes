import { forwardRef, useState } from "react"
import { Input, type FieldProps, type InputProps } from "@headlessui/react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"
import InputField from "./InputField"

type PasswordFieldProps = Omit<
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

const PasswordField = forwardRef<
  React.ComponentRef<typeof Input>,
  PasswordFieldProps
>((props, ref) => {
  const [passwordVisible, setPasswordVisible] = useState(false)

  return (
    <InputField
      ref={ref}
      type={passwordVisible ? "text" : "password"}
      adornment={{
        icon: passwordVisible ? EyeSlashIcon : EyeIcon,
        onClick: () => setPasswordVisible((previousValue) => !previousValue),
      }}
      {...props}
    />
  )
})

export default PasswordField
