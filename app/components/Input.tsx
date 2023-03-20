import type { ForwardedRef } from "react";
import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type InputProps = {
  name?: string;
  label: string;
  hiddenLabel?: boolean;
  border?: boolean;
  id?: string;
  className?: string;
  classNameInput?: string;
  errorMessage?: string | null;
  description?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef(function Input(
  {
    label,
    className,
    name,
    errorMessage,
    id,
    hiddenLabel = true,
    border = false,
    classNameInput,
    description,
    ...rest
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const isCheckbox = rest.type === "checkbox";
  return (
    <div className={twMerge(className)}>
      <label
        htmlFor={id}
        className={twMerge(
          "text-md block font-medium text-slate-900 ",
          hiddenLabel && "sr-only"
        )}
      >
        {label}
      </label>
      {description && <p className="text-sm text-slate-500">{description}</p>}
      <input
        type="text"
        name={name}
        id={id}
        ref={ref}
        placeholder={hiddenLabel ? label : undefined}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={`${id}-error`}
        {...rest}
        className={twMerge(
          "block w-full rounded-md border-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500",
          border && "border-gray-300 shadow-sm",
          isCheckbox && "mt-auto h-5 w-5",
          classNameInput
        )}
      />

      {errorMessage && (
        <p
          id={`${id}-error`}
          className="mt-0.5  text-red-600 dark:text-red-500"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
});
