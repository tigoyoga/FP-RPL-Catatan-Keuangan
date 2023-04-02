import { useState } from "react";
import { RegisterOptions, useForm, useFormContext } from "react-hook-form";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";

type InputProps = {
  id: string;
  label: string;
  placeholder?: string;
  validation?: RegisterOptions;
  helperText?: string;
} & React.ComponentPropsWithoutRef<"input">;

export default function Input({
  id,
  label,
  placeholder = "",
  helperText,
  validation,
  required,
  ...rest
}: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const error = errors[id];
  return (
    <div className="mt-2 flex flex-col justify-start relative w-full px-5 bg-[#1A1B22] rounded-2xl min-h-[79px] mb-16">
      <label className="text-left font-medium text-white" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          {...rest}
          className={`
        ${
          error
            ? "ring-1 focus:ring-red-500 focus:ring-2 ring-red-500 bg-red-100"
            : "focus:ring-primary"
        }
        shadow appearance-none placeholder:text-neutral-400 outline-none border focus:ring-1 rounded w-full p-1 pl-2 text-black`}
          type={`${showPassword ? "text" : "password"}`}
          id={id}
          placeholder={placeholder}
          {...register(id, validation)}
        />
        <button
          onClick={togglePassword}
          type="button"
          className="absolute inset-y-0 right-0 mr-3 flex items-center rounded-lg p-1 focus:outline-none focus:ring focus:ring-primary/50"
        >
          {showPassword ? (
            <RxEyeOpen className="cursor-pointer text-xl text-gray-500 hover:text-gray-600" />
          ) : (
            <RxEyeClosed className="cursor-pointer text-xl text-gray-500 hover:text-gray-600" />
          )}
        </button>
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
