import { forwardRef, DetailedHTMLProps, InputHTMLAttributes } from "react"
import { Input, Field, Label } from "@headlessui/react"

type TextFieldProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "ref"
> & { label: string; error?: string }

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, ...inputProps }, ref) => {
    return (
      <Field>
        <Label
          className={`text-sm/6 font-medium ${error ? "text-red-700" : ""}`}
        >
          {label}
        </Label>
        <Input
          ref={ref}
          {...inputProps}
          type="text"
          className={`mt-1 block w-full rounded-lg border px-3 py-1.5 text-sm/6 ${error ? "border-red-700" : "border-gray-300"}`}
        />
        {error && <span className="text-sm/6 text-red-700">{error}</span>}
      </Field>
    )
  },
)

export default TextField
