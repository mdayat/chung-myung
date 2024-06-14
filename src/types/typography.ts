import React from "react";

interface TypographyProps {
  children?: React.ReactNode;
  className?: string;
  variant:
    | "d1"
    | "d2"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p1"
    | "p2"
    | "p3"
    | "p4"
    | "p5"
    | "caption"
    | "footer";
  font?: "nunito" | "karla";
  weight?: "bold" | "light" | "normal";
}

export type { TypographyProps };
