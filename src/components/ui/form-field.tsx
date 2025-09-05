import * as React from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Input } from "./input"

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  placeholder?: string
  type?: string
  className?: string
  disabled?: boolean
  required?: boolean
}

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  className,
  disabled,
  required,
}: FormFieldProps<TFieldValues, TName>) => {
  const [field, fieldState] = React.useMemo(() => {
    const fieldState = control.getFieldState(name)
    const field = control.register(name)
    return [field, fieldState]
  }, [control, name])

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <Input
        {...field}
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          fieldState.error && "border-destructive focus-visible:ring-destructive"
        )}
      />
      {fieldState.error && (
        <p className="text-sm text-destructive">
          {fieldState.error.message}
        </p>
      )}
    </div>
  )
}

FormField.displayName = "FormField"

export { FormField, type FormFieldProps }