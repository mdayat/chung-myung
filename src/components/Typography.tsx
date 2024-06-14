import { forwardRef } from "react";
import type { TypographyProps } from "../types/typography";

function determineFontWeight(fontWeight: string): string {
  let tailwindClass = "";

  switch (fontWeight) {
    case "normal": {
      tailwindClass = "font-normal";
      break;
    }

    case "light": {
      tailwindClass = "font-light";
      break;
    }

    case "bold": {
      tailwindClass = "font-bold";
      break;
    }
  }

  return tailwindClass;
}

const Typography = forwardRef<
  HTMLHeadingElement | HTMLParagraphElement,
  TypographyProps
>(
  (
    { children, font = "karla", variant, weight = "normal", className = "" },
    ref
  ) => {
    const fontWeight = determineFontWeight(weight);
    const variantFont = font === "karla" ? "font-karla" : "font-nunito";

    switch (variant) {
      // Font Display
      case "d1":
        return (
          <h1
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[72px] leading-[80px] tracking-[-2.88px]`}
          >
            {children}
          </h1>
        );

      case "d2":
        return (
          <h2
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[60px] leading-[72px] tracking-[-2.4px]`}
          >
            {children}
          </h2>
        );

      // Font Heading
      case "h1":
        return (
          <h1
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[48px] leading-[56px] tracking-[-1.92px]`}
          >
            {children}
          </h1>
        );

      case "h2":
        return (
          <h2
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[36px] leading-[40px] tracking-[-0.72px]`}
          >
            {children}
          </h2>
        );

      case "h3":
        return (
          <h3
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[32px] leading-none tracking-[-0.64px]`}
          >
            {children}
          </h3>
        );

      case "h4":
        return (
          <h4
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[28px] leading-none tracking-[-0.56px]`}
          >
            {children}
          </h4>
        );

      case "h5":
        return (
          <h5
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[24px] leading-none`}
          >
            {children}
          </h5>
        );

      case "h6":
        return (
          <h6
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[20px] leading-none`}
          >
            {children}
          </h6>
        );

      // Font Body / Paragraph
      case "p1":
        return (
          <p
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[24px]`}
          >
            {children}
          </p>
        );

      case "p2":
        return (
          <p
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[20px]`}
          >
            {children}
          </p>
        );

      case "p3":
        return (
          <p
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[16px] leading-[125%]`}
          >
            {children}
          </p>
        );

      case "p4":
        return (
          <p
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[14px]`}
          >
            {children}
          </p>
        );

      case "p5":
        return (
          <p
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[12px]`}
          >
            {children}
          </p>
        );

      // Font Caption
      case "caption":
        return (
          <p
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[11px]`}
          >
            {children}
          </p>
        );

      // Font Footer
      case "footer":
        return (
          <p
            ref={ref}
            className={`${variantFont} ${fontWeight} ${className} text-[10px]`}
          >
            {children}
          </p>
        );
    }
  }
);

Typography.displayName = "Typography";

export { Typography };
