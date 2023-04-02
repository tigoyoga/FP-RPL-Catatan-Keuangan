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
    <div className="mt-2 flex flex-col justify-start relative w-full px-5 bg-[#1A1B22] rounded-2xl min-h-[79px] mb-4">
      <label className="text-left font-medium text-white" htmlFor={id}>
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
        shadow appearance-none placeholder:text-neutral-400 outline-none border focus:ring-1 rounded w-full p-1 pl-2 text-black`}
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
