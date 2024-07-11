import type { ComponentPropsWithoutRef } from "react";

interface BlurredCircleProps extends ComponentPropsWithoutRef<"div"> {
  colorType?: "red" | "blue";
}

export function BlurredCircle({
  className,
  colorType = "blue",
}: BlurredCircleProps) {
  return (
    <div
      className={`rounded-full blur ${colorType === "blue" ? "bg-secondary-100" : "bg-error-50"} ${className}`}
    ></div>
  );
}
