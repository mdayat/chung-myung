import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
} from "react";
import { Root, Indicator } from "@radix-ui/react-progress";

import { cn } from "@lib/shadcn";

interface ProgressProps extends ComponentPropsWithoutRef<typeof Root> {
  bgColor?: string;
  indicatorColor?: string;
}

const Progress = forwardRef<ElementRef<typeof Root>, ProgressProps>(
  (
    {
      bgColor = "bg-neutral-100",
      indicatorColor = "bg-secondary-500",
      max = 100,
      value = 0,
      className,
      ...props
    },
    ref
  ) => (
    <Root
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-full w-full h-2",
        bgColor,
        className
      )}
      {...props}
    >
      <Indicator
        className={`${indicatorColor} transition-all duration-300 w-full h-full`}
        style={{
          transform: `translateX(-${100 - (value! / max) * 100}%)`,
        }}
      />
    </Root>
  )
);
Progress.displayName = Root.displayName;

export { Progress };
