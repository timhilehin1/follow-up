// components/ui/PasswordInput.tsx
import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  label?: string;
  variant?: "default" | "danger";
  name?: string;
}

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "Enter password",
  className = "",
  required = false,
  label,
  variant = "default",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const baseClassName =
    "outline-0 px-4 py-2 pr-12 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full ";
  const variantClassName =
    variant === "danger"
      ? "focus:border-red-500 focus:ring-red-500"
      : "focus:border-[#0053A6] focus:ring-[#0053A6]";

  const finalClassName = `${baseClassName} ${variantClassName} ${className}`;

  return (
    <div className="flex flex-col gap-2 mb-6">
      {label && (
        <label className="" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={finalClassName}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <IoEyeOffOutline size={20} />
          ) : (
            <IoEyeOutline size={20} />
          )}
        </button>
      </div>
    </div>
  );
}
