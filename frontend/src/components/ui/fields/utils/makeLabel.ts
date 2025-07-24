export function makeLabel(label: string, required?: boolean) {
  return required ? `${label} (required)` : label
}
