import { FC } from "react"
import { Switch, Field, Label } from "@headlessui/react"

interface SwitchFieldProps {
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  label: string
}

const SwitchField: FC<SwitchFieldProps> = ({
  checked,
  onChange,
  disabled,
  label,
}) => {
  return (
    <Field className="flex items-center gap-2" disabled={disabled || false}>
      <Label className="text-sm/6 font-medium data-[disabled]:opacity-50">
        {label}
      </Label>
      <Switch
        checked={checked}
        onChange={onChange}
        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition data-[disabled]:cursor-not-allowed data-[checked]:bg-sky-700 data-[disabled]:opacity-50"
      >
        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
      </Switch>
    </Field>
  )
}

export default SwitchField
