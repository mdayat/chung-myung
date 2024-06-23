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
          "bg-secondary-500 text-neutral-0 [&_svg]:fill-neutral-0 hover:bg-secondary-600 active:shadow-xs disabled:bg-neutral-500/50 disabled:text-neutral-50 [&_svg]:disabled:fill-neutral-50",
        secondary:
          "bg-transparent text-secondary-600 [&_svg]:fill-secondary-500 border-2 border-secondary-500 !py-2 hover:bg-secondary-500/20 active:shadow-xs disabled:text-neutral-500/50 [&_svg]:disabled:fill-neutral-500/50 disabled:border-neutral-500/50",
        tertiary:
          "bg-neutral-300 text-neutral-50 [&_svg]:fill-neutral-50 hover:bg-neutral-500 active:shadow-xs disabled:bg-neutral-500/50",
        ghost:
          "bg-transparent text-secondary-500 [&_svg]:fill-secondary-500 hover:underline disabled:text-neutral-500/50 [&_svg]:disabled:fill-neutral-500/50",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
