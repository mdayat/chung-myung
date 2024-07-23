import { forwardRef, type PropsWithChildren } from "react";

type Variant =
  | "d1"
  | "d2"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "b1"
  | "b2"
  | "b3"
  | "b4"
  | "b5"
  | "caption"
  | "footer";
type FontWeight = "bold" | "light" | "normal";
type FontFamily = "nunito" | "karla";
type AllowedElements = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

interface TypographyProps extends PropsWithChildren {
  variant: Variant;
  as?: AllowedElements;
  className?: string;
  font?: FontFamily;
  weight?: FontWeight;
}

const Typography = forwardRef<
  HTMLHeadingElement | HTMLParagraphElement,
  TypographyProps
>(
  (
    {
      font = "karla",
      weight = "normal",
      as = "p",
      className = "",
      children,
      variant,
    },
    ref,
  ) => {
    const variantStyles = generateStyles(variant);
    const fontWeight = determineFontWeight(weight);
    const fontVariant = font === "karla" ? "font-karla" : "font-nunito";
    const Component = as || determineDefaultElement(variant);

    return (
      <Component
        ref={ref}
        className={`${variantStyles} ${fontVariant} ${fontWeight} ${className}`}
      >
        {children}
      </Component>
    );
  },
);

Typography.displayName = "Typography";

function determineDefaultElement(variant: Variant): AllowedElements {
  let element: AllowedElements = "p";
  if (variant === "d1" || variant === "h1") {
    element = "h1";
  } else if (variant === "d2" || variant === "h2") {
    element = "h2";
  } else if (variant === "h3") {
    element = "h3";
  } else if (variant === "h4") {
    element = "h4";
  } else if (variant === "h5") {
    element = "h5";
  } else if (variant === "h6") {
    element = "h6";
  } else if (
    variant === "b1" ||
    variant === "b2" ||
    variant === "b3" ||
    variant === "b4" ||
    variant === "b5" ||
    variant === "caption" ||
    variant === "footer"
  ) {
    element = "p";
  }
  return element;
}

function determineFontWeight(fontWeight: FontWeight): string {
  let className = "";
  switch (fontWeight) {
    case "normal": {
      className = "font-normal";
      break;
    }
    case "light": {
      className = "font-light";
      break;
    }
    case "bold": {
      className = "font-bold";
      break;
    }
  }
  return className;
}

function generateStyles(variant: Variant): string {
  let className = "";
  switch (variant) {
    case "d1": {
      className = "text-7xl leading-[80px] tracking-[-2.88px]";
      break;
    }
    case "d2": {
      className = "text-6xl leading-[72px] tracking-[-2.4px]";
      break;
    }
    case "h1": {
      className = "text-5xl leading-[56px] tracking-[-1.92px]";
      break;
    }
    case "h2": {
      className = "text-4xl tracking-[-0.72px]";
      break;
    }
    case "h3": {
      className = "text-[32px] leading-none tracking-[-0.64px]";
      break;
    }
    case "h4": {
      className = "text-[28px] leading-none tracking-[-0.56px]";
      break;
    }
    case "h5": {
      className = "text-2xl leading-none";
      break;
    }
    case "h6": {
      className = "text-xl leading-none";
      break;
    }
    case "b1": {
      className = "text-2xl";
      break;
    }
    case "b2": {
      className = "text-xl";
      break;
    }
    case "b3": {
      className = "text-base leading-5";
      break;
    }
    case "b4": {
      className = "text-sm";
      break;
    }
    case "b5": {
      className = "text-xs";
      break;
    }
    case "caption": {
      className = "text-xs";
      break;
    }
    case "footer": {
      className = "text-[10px]";
      break;
    }
  }
  return className;
}

export { Typography };
