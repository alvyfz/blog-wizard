import * as React from "react";
import {
  Controller,
  Control,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "./input";

// Form Context
const FormContext = React.createContext<{
  control?: Control<any>
}>({});

const useFormField = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("useFormField should be used within <Form>");
  }
  return context;
};

// Form Provider
interface FormProps<TFieldValues extends FieldValues = FieldValues> {
  children: React.ReactNode
  control: Control<TFieldValues>
}

const Form = <TFieldValues extends FieldValues = FieldValues>({ children, control }: FormProps<TFieldValues>) => {
  return (
    <FormContext.Provider value={{ control }}>{children}</FormContext.Provider>
  );
};

// Form Item
interface FormItemProps {
  children: React.ReactNode;
  className?: string;
}

const FormItem = ({ children, className }: FormItemProps) => {
  return <div className={cn("space-y-2", className)}>{children}</div>;
};

// Form Label
interface FormLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

const FormLabel = ({
  children,
  htmlFor,
  required,
  className,
}: FormLabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
};

// Form Control
interface FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  children: (field: { value: unknown; onChange: (value: unknown) => void; onBlur: () => void; error?: string }) => React.ReactNode;
}

const FormControl = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  children,
}: FormControlProps<TFieldValues, TName>) => {
  const { control } = useFormField();

  if (!control) {
    throw new Error("FormControl must be used within a Form");
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <>
          {children({ ...field, error: fieldState.error?.message })}
        </>
      )}
    />
  );
};

// Form Message
interface FormMessageProps {
  children?: React.ReactNode;
  className?: string;
}

const FormMessage = ({ children, className }: FormMessageProps) => {
  return (
    <p className={cn("text-sm text-destructive", className)}>{children}</p>
  );
};

// Form Input Field
interface FormInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  label?: string
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FormInputField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  placeholder,
  type = "text",
  required,
  disabled,
  className,
  onChange: customOnChange,
}: FormInputFieldProps<TFieldValues, TName>) => {
  const { control } = useFormField();

  if (!control) {
    throw new Error("FormInputField must be used within a Form");
  }

  return (
    <FormItem className={className}>
      {label && (
        <FormLabel htmlFor={name} required={required}>
          {label}
        </FormLabel>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <>
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              value={String(value || "")}
              onChange={(e) => {
                onChange(e)
                if (customOnChange) {
                  customOnChange(e)
                }
              }}
              onBlur={onBlur}
              className={fieldState.error ? "border-destructive" : ""}
            />
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </>
        )}
      />
    </FormItem>
  );
};

// FormField component untuk react-hook-form integration
interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  render: ({
    field,
    fieldState,
    formState,
  }: {
    field: {
      value: any;
      onChange: (value: any) => void;
      onBlur: () => void;
      name: TName;
    };
    fieldState: {
      error?: { message?: string };
    };
    formState: any;
  }) => React.ReactElement;
}

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  render,
}: FormFieldProps<TFieldValues, TName>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => {
        return render({
          field,
          fieldState,
          formState,
        });
      }}
    />
  );
};

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormInputField,
  FormField,
  useFormField,
  type FormProps,
  type FormInputFieldProps,
  type FormFieldProps,
};
