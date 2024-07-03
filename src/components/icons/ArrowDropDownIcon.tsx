import type { ComponentPropsWithRef } from "react";

export function ArrowDropDownIcon({ className }: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M7.41289 11.3815L11.0199 14.9885C11.563 15.5316 12.4404 15.5316 12.9835 14.9885L16.5905 11.3815C17.4679 10.5041 16.8412 9 15.6018 9H8.38776C7.14829 9 6.53552 10.5041 7.41289 11.3815Z" />
    </svg>
  );
}
