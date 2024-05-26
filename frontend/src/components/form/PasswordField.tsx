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
  "ref"
> & { label: string; error?: string }

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, ...inputProps }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <Field>
        <Label
          className={`text-sm/6 font-medium ${error ? "text-red-700" : ""}`}
        >
          {label}
        </Label>
        <div className="relative mt-1">
          <Input
            ref={ref}
            {...inputProps}
            type={showPassword ? "text" : "password"}
            className={`block w-full rounded-lg border px-3 py-1.5 pr-10 text-sm/6 ${error ? "border-red-700" : "border-gray-300"}`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Button
              type="button"
              onClick={() => setShowPassword((previousValue) => !previousValue)}
            >
              {showPassword ? (
                <EyeSlashIcon className="size-6" />
              ) : (
                <EyeIcon className="size-6" />
              )}
            </Button>
          </div>
        </div>
        {error && <span className="text-sm/6 text-red-700">{error}</span>}
      </Field>
    )
  },
)

export default PasswordField
