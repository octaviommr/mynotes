import { forwardRef, DetailedHTMLProps, TextareaHTMLAttributes } from "react"
import { Textarea, Field, Label } from "@headlessui/react"

type TextareaFieldProps = Omit<
  DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  "ref"
> & { label: string; error?: string }

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, disabled, ...textareaProps }, ref) => {
    // set up a data attribute to be able to conditionally apply styling when in an error state
    const dataAttrs = { ...(error && { "data-error": true }) }

    return (
      <Field className="group" disabled={disabled || false} {...dataAttrs}>
        <Label className="text-sm/6 font-medium data-[disabled]:opacity-50 group-data-[error]:text-red-700">
          {label}
        </Label>
        <Textarea
          ref={ref}
          {...textareaProps}
          className="mt-1 block w-full resize-none rounded-lg border border-gray-300 px-3 py-1.5 text-sm/6 data-[disabled]:border-opacity-50 data-[disabled]:bg-gray-100 group-data-[error]:border-red-700"
        />
        {error && <span className="text-sm/6 text-red-700">{error}</span>}
      </Field>
    )
  },
)

export default TextareaField
