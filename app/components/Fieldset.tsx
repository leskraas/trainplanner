import type { FieldsetHTMLAttributes, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type FieldsetProps = {
  children: ReactNode;
} & FieldsetHTMLAttributes<HTMLFieldSetElement>;

export const Fieldset = forwardRef(function Fieldset(
  { children, className, ...fieldsetAttributes }: FieldsetProps,
  ref: ForwardedRef<HTMLFieldSetElement>
): JSX.Element {
  return (
    <fieldset
      className={twMerge(
        "divide-y divide-stone-100 rounded-md bg-white shadow-sm",
        className
      )}
      {...fieldsetAttributes}
      ref={ref}
    >
      {children}
    </fieldset>
  );
});
