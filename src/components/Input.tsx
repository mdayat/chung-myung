import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  labelName: string; // Label name must be unique
  description?: string;
  error?: boolean;
  width?: string;
  leftIcon?: ReactNode;
}

function Input({
  labelName,
  description,
  type = "text",
  width = "w-[320px]",
  required = false,
  error = false,
  leftIcon,
}: InputProps) {
  const formattedLabelName = labelName.toLowerCase().split(" ").join("-");
  const asterisk = required
    ? "after:content-['*'] after:ml-0.5 after:text-error"
    : "";
  const inputBorder = error
    ? "border-error-600"
    : "border-secondary-200 has-[:focus]:border-2 has-[:focus]:border-secondary-600";

  return (
    <div className={`${width} flex flex-col gap-y-2`}>
      <label htmlFor={formattedLabelName} className={`${asterisk} text-base`}>
        {labelName}
      </label>

      <div
        className={`${inputBorder} w-full flex items-center gap-x-2 border-2 py-2 px-4 rounded-[8px]`}
      >
        {leftIcon && leftIcon}
        <input
          id={formattedLabelName}
          type={type}
          required={required}
          className="w-full bg-transparent text-base focus:outline-none"
        />
      </div>

      {description !== "" && (
        <p className={`${error ? "text-error-500" : ""} text-xs`}>{description}</p>
      )}
    </div>
  );
}

export default Input;
