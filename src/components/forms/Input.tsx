import { RegisterOptions, useForm, useFormContext } from "react-hook-form";

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

  const error = errors[id];

  return (
    <div className="mt-2 flex flex-col justify-start relative">
      <label
        className="relative text-left text-xs font-medium text-[#FFFFFF80] z-[3] -bottom-5 pl-2"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        {...rest}
        className={`
        ${
          error
            ? "ring-1 focus:ring-red-500 focus:ring-2 ring-red-500 bg-red-100"
            : "focus:ring-primary"
        }
        bg-[#1A1B22] py-6 rounded-2xl shadow appearance-none placeholder:text-white outline-none hover:border focus:ring-2 w-full p-1 pl-2 text-white`}
        type="text"
        id={id}
        placeholder={placeholder}
        {...register(id, validation)}
      />
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
