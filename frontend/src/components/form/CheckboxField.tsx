import { FC } from "react"
import { Checkbox, Field, Label } from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/16/solid"

interface CheckboxFieldProps {
  name: string
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  label: string
}

const CheckboxField: FC<CheckboxFieldProps> = ({
  name,
  checked,
  onChange,
  disabled,
  label,
}) => {
  return (
    <Field className="flex items-center gap-2" disabled={disabled}>
      <Label className="text-sm/6 font-medium data-[disabled]:opacity-50">
        {label}
      </Label>
      <Checkbox
        checked={checked}
        onChange={onChange}
        name={name}
        className="group size-6 rounded-md bg-white p-1 ring-1 ring-inset ring-gray-300 hover:cursor-default data-[checked]:bg-sky-700 data-[checked]:ring-sky-300"
      >
        <CheckIcon className="hidden size-4 fill-white group-data-[checked]:block" />
      </Checkbox>
    </Field>
  )
}

export default CheckboxField
