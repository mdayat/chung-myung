import { cn } from "@lib/shadcn";
import { Indicator, Root } from "@radix-ui/react-progress";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";

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
    ref,
  ) => (
    <Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        bgColor,
        className,
      )}
      {...props}
    >
      <Indicator
        className={`${indicatorColor} h-full w-full transition-all duration-300`}
        style={{
          transform: `translateX(-${100 - (value! / max) * 100}%)`,
        }}
      />
    </Root>
  ),
);
Progress.displayName = Root.displayName;

export { Progress };
