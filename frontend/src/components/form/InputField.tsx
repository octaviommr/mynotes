import { forwardRef, DetailedHTMLProps, InputHTMLAttributes } from "react"
import { Input, Field, Label } from "@headlessui/react"

type InputFieldProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "ref"
> & { label: string; error?: string }

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, disabled, ...inputProps }, ref) => {
    // set up a data attribute to be able to conditionally apply styling when in an error state
    const dataAttrs = { ...(error && { "data-error": true }) }

    return (
      <Field className="group" disabled={disabled || false} {...dataAttrs}>
        <Label className="text-sm/6 font-medium data-[disabled]:opacity-50 group-data-[error]:text-red-700">
          {label}
        </Label>
        <Input
          ref={ref}
          {...inputProps}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm/6 data-[disabled]:border-opacity-50 data-[disabled]:bg-gray-100 group-data-[error]:border-red-700"
        />
        {error && (
          <span role="alert" className="text-sm/6 text-red-700">
            {error}
          </span>
        )}
      </Field>
    )
  },
)

export default InputField
