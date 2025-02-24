import { forwardRef, DetailedHTMLProps, InputHTMLAttributes } from "react"
import { Input, Field, Label } from "@headlessui/react"

type TextFieldProps = Pick<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "name" | "onChange" | "onBlur" | "required" | "disabled"
> & { label: string; error?: string }

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, required, disabled, ...props }, ref) => {
    return (
      <Field className="group" disabled={disabled}>
        <Label className="text-sm/6 font-medium data-[disabled]:opacity-50">
          {`${label}${required ? " (required)" : ""}`}
        </Label>
        <Input
          ref={ref}
          {...props}
          invalid={!!error}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm/6 data-[invalid]:border-red-700 data-[disabled]:border-opacity-50 data-[disabled]:bg-gray-100"
          aria-required={required}
          aria-errormessage={`${props.name}-error-message`}
        />
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

export default TextField
