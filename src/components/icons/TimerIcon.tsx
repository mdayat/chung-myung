import type { ComponentPropsWithRef } from "react";

export function TimerIcon({ className }: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M15.0701 1.01001H9.07007V3.01001H15.0701V1.01001ZM11.0701 14.01H13.0701V8.01001H11.0701V14.01ZM19.1001 7.39001L20.5201 5.97001C20.0901 5.46001 19.6201 4.98001 19.1101 4.56001L17.6901 5.98001C16.1401 4.74001 14.1901 4.00001 12.0701 4.00001C7.10007 4.00001 3.07007 8.03001 3.07007 13C3.07007 17.97 7.09007 22 12.0701 22C17.0501 22 21.0701 17.97 21.0701 13C21.0701 10.89 20.3301 8.94001 19.1001 7.39001ZM12.0701 20.01C8.20007 20.01 5.07007 16.88 5.07007 13.01C5.07007 9.14001 8.20007 6.01001 12.0701 6.01001C15.9401 6.01001 19.0701 9.14001 19.0701 13.01C19.0701 16.88 15.9401 20.01 12.0701 20.01Z" />
    </svg>
  );
}
