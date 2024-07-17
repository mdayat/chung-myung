import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib/shadcn";

const buttonVariants = cva(
  "font-bold inline-flex justify-between items-center rounded-full transition-colors disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-secondary-500 text-neutral-0 [&_svg]:fill-neutral-0 hover:bg-secondary-600 active:bg-secondary-600 active:shadow-xs disabled:bg-neutral-300 disabled:text-neutral-25 [&_svg]:disabled:fill-neutral-25",
        secondary:
          "bg-transparent text-secondary-500 [&_svg]:fill-secondary-500 border-2 border-secondary-500 !py-2 hover:bg-secondary-500/20 active:bg-secondary-500/20 active:shadow-xs disabled:text-neutral-300 [&_svg]:disabled:fill-neutral-300 disabled:border-neutral-300",
        tertiary:
          "bg-neutral-500 text-neutral-25 [&_svg]:fill-neutral-25 hover:bg-neutral-600 active:bg-neutral-600 active:shadow-xs disabled:bg-neutral-300",
        ghost:
          "bg-transparent text-secondary-500 [&_svg]:fill-secondary-500 hover:underline disabled:text-neutral-300 [&_svg]:disabled:fill-neutral-300",
      },
      size: {
        small: "text-sm [&_svg]:w-5 [&_svg]:h-5 gap-1.5 py-2.5 px-3",
        medium: "text-base [&_svg]:w-6 [&_svg]:h-6 gap-2 py-2.5 px-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, type = "button", ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={type}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
