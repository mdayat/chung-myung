import type { ComponentPropsWithRef } from "react";

export function HeartOutlineIcon({ className }: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
    >
      <path d="M39.2664 10.3174C42.9628 8.89267 47.5076 8.63575 52.4468 11.1053C58.8538 14.3088 61.2706 19.9689 60.8724 25.9412C60.4784 31.85 57.3456 38.068 52.7066 42.7068L52.6788 42.7346C48.2998 47.1138 40.5332 54.8804 34.8226 59.2232C33.1412 60.5016 30.8446 60.4372 29.217 59.1234C23.9918 54.9058 15.6333 47.0476 11.2925 42.7068C6.65353 38.068 3.52069 31.85 3.12679 25.9412C2.72863 19.9689 5.14541 14.3088 11.5524 11.1053C16.4915 8.63575 21.0364 8.89267 24.7328 10.3174C27.8446 11.5167 30.342 13.5357 31.9996 15.4182C33.6572 13.5357 36.1546 11.5167 39.2664 10.3174ZM39.986 12.1836C36.7308 13.4382 34.2072 15.7234 32.8 17.5998L32 18.6665L31.2 17.5998C29.7926 15.7234 27.269 13.4382 24.0138 12.1836C20.7926 10.9421 16.8375 10.699 12.4471 12.8942C6.85408 15.6907 4.77084 20.5306 5.1227 25.8082C5.47878 31.1496 8.34594 36.9316 12.707 41.2926C17.0263 45.612 25.3278 53.4138 30.4734 57.5672C31.401 58.3158 32.6798 58.3404 33.6122 57.6312C39.203 53.3796 46.8838 45.7018 51.2928 41.2926C55.6538 36.9316 58.521 31.1496 58.8772 25.8082C59.229 20.5306 57.1458 15.6907 51.5526 12.8942C47.1622 10.699 43.2072 10.9421 39.986 12.1836Z" />
    </svg>
  );
}