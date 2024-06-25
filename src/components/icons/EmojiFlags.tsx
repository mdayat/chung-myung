export function EmojiFlags({ className = "" }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_170_10287)">
        <path d="M14 9L13 7H7V5.72C7.6 5.38 8 4.74 8 4C8 2.9 7.1 2 6 2C4.9 2 4 2.9 4 4C4 4.74 4.4 5.38 5 5.72V21H7V17H12L13 19H20V9H14ZM18 17H14L13 15H7V9H12L13 11H18V17Z" />
      </g>
      <defs>
        <clipPath id="clip0_170_10287">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
