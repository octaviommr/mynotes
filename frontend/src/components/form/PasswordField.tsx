import {
  forwardRef,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
} from "react"
import { Input, Field, Label, Button } from "@headlessui/react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"

type PasswordFieldProps = Pick<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "name" | "onChange" | "onBlur" | "required" | "disabled"
> & { label: string; error?: string }

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, required, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <Field className="group" disabled={disabled}>
        <Label className="text-sm/6 font-medium data-[disabled]:opacity-50">
          {`${label}${required ? " (required)" : ""}`}
        </Label>
        <div className="relative mt-1">
          <Input
            ref={ref}
            {...props}
            type={showPassword ? "text" : "password"}
            invalid={!!error}
            className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 pr-10 text-sm/6 data-[invalid]:border-red-700 data-[disabled]:border-opacity-50 data-[disabled]:bg-gray-100"
            aria-required={required}
            aria-errormessage={`${props.name}-error-message`}
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
          <p
            id={`${props.name}-error-message`}
            className="text-sm/6 text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}
      </Field>
    )
  },
)

export default PasswordField
