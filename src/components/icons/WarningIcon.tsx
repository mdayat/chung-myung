import type { ComponentPropsWithRef } from "react";

export function WarningIcon({ className }: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
    >
      <path d='M4.47 21.0002H19.53C21.07 21.0002 22.03 19.3302 21.26 18.0002L13.73 4.99018C12.96 3.66018 11.04 3.66018 10.27 4.99018L2.74 18.0002C1.97 19.3302 2.93 21.0002 4.47 21.0002ZM12 14.0002C11.45 14.0002 11 13.5502 11 13.0002V11.0002C11 10.4502 11.45 10.0002 12 10.0002C12.55 10.0002 13 10.4502 13 11.0002V13.0002C13 13.5502 12.55 14.0002 12 14.0002ZM13 18.0002H11V16.0002H13V18.0002Z' />
    </svg>
  );
}
