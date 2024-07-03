// Both "ChevronRight" or "KeyboardArrowRight" are the same
import type { ComponentPropsWithRef } from "react";

export function ChevronRightIcon({ className }: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M9.29006 6.70978C8.90006 7.09978 8.90006 7.72978 9.29006 8.11978L13.1701 11.9998L9.29006 15.8798C8.90006 16.2698 8.90006 16.8998 9.29006 17.2898C9.68006 17.6798 10.3101 17.6798 10.7001 17.2898L15.2901 12.6998C15.6801 12.3098 15.6801 11.6798 15.2901 11.2898L10.7001 6.69978C10.3201 6.31978 9.68006 6.31978 9.29006 6.70978Z" />
    </svg>
  );
}