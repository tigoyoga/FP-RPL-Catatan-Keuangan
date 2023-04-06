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
    <div className="mt-2 flex flex-col justify-start relative">
      <label
        className="relative text-left text-xs font-medium text-[#FFFFFF80] z-[3] -bottom-5 pl-2"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative z-[2]">
        <input
          {...rest}
          className={`
        ${
          error
            ? "ring-1 focus:ring-red-500 focus:ring-2 ring-red-500 bg-red-100"
            : "focus:ring-primary"
        }
        bg-[#34364c89] py-6 rounded-2xl shadow appearance-none placeholder:text-white outline-none hover:border focus:ring-2 w-full p-1 pl-2 text-white`}
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
            <RxEyeOpen className="cursor-pointer text-xl text-white hover:text-[#8997ff]" />
          ) : (
            <RxEyeClosed className="cursor-pointer text-xl text-white hover:text-[#8997ff]" />
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
