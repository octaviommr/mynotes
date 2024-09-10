import {
  forwardRef,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
} from "react"
import { Input, Field, Label, Button } from "@headlessui/react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"

type PasswordFieldProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "ref" | "type"
> & { label: string; error?: string }

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, disabled, ...inputProps }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    // set up a data attribute to be able to conditionally apply styling when in an error state
    const dataAttrs = { ...(error && { "data-error": true }) }

    return (
      <Field className="group" disabled={disabled || false} {...dataAttrs}>
        <Label className="text-sm/6 font-medium data-[disabled]:opacity-50 group-data-[error]:text-red-700">
          {label}
        </Label>
        <div className="relative mt-1">
          <Input
            ref={ref}
            {...inputProps}
            type={showPassword ? "text" : "password"}
            className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 pr-10 text-sm/6 data-[disabled]:border-opacity-50 data-[disabled]:bg-gray-100 group-data-[error]:border-red-700"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Button
              type="button"
              className="data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
              onClick={() => setShowPassword((previousValue) => !previousValue)}
              disabled={disabled || false}
            >
              {showPassword ? (
                <EyeSlashIcon className="size-6" />
              ) : (
                <EyeIcon className="size-6" />
              )}
            </Button>
          </div>
        </div>
        {error && (
          <span role="alert" className="text-sm/6 text-red-700">
            {error}
          </span>
        )}
      </Field>
    )
  },
)

export default PasswordField
