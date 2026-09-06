export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectFieldProps {
  label: string
  options: MultiSelectOption[]
  values: string[]
  onChange: (values: string[]) => void
}

/** Checkbox grid — used for the amenities multi-select across all five domains. */
export function MultiSelectField({ label, options, values, onChange }: MultiSelectFieldProps) {
  function toggle(value: string) {
    onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value])
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-text-primary">{label}</legend>
      {options.length === 0 ? (
        <p className="text-sm text-text-muted">Nenhuma comodidade cadastrada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm text-text-primary bg-bg-surface border border-border-hairline rounded-lg px-3 py-2 cursor-pointer hover:bg-bg-subtle"
            >
              <input
                type="checkbox"
                checked={values.includes(option.value)}
                onChange={() => toggle(option.value)}
                className="w-4 h-4 rounded border-border-hairline text-accent focus:ring-accent"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </fieldset>
  )
}
