import clsx from "clsx";
import * as React from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { HiExclamationCircle } from "react-icons/hi";

export type SelectInputProps = {
  label: string;
  id: string;
  placeholder?: string;
  helperText?: string;
  type?: string;
  validation?: RegisterOptions;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"select">;

export default function SelectInput({
  label,
  helperText,
  id,
  placeholder,
  children,
  validation,
  ...rest
}: SelectInputProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const value = watch(id);
  const error = errors[id];

  return (
    <div>
      <label
        htmlFor={id}
        className="block relative text-left text-xs font-medium text-white mt-4 pl-2"
      >
        {label}
      </label>
      <div className="relative mt-1">
        <select
          {...register(id, validation)}
          defaultValue=""
          {...rest}
          name={id}
          id={id}
          className={clsx(
            errors[id]
              ? "bg-red-100 focus:ring-2 ring-1 ring-red-500 focus:border-0 outline-none focus:ring-red-500"
              : "focus:ring-1 focus:border-0 focus:ring-primary",
            "bg-[#1A1B22] shadow cursor-pointer appearance-none placeholder:text-neutral-400 outline-none border-[#525581] focus:ring-1 rounded w-full p-1 pl-2 text-white",
            { "text-white": value === "" }
          )}
          aria-describedby={id}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>
      </div>
      <div className="mt-1">
        {helperText && (
          <p className="text-left text-xs text-neutral-500">{helperText}</p>
        )}
        {error && (
          <p className="text-left font-normal leading-none text-[#F32013]">
            {error.message as unknown as string}
          </p>
        )}
      </div>
    </div>
  );
}
