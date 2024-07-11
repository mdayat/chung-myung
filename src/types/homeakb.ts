import { Dispatch } from "react";
import { type SetStateAction } from "react";

interface StartAKB {
  isStartAsesmen: string;
  setStartAsesmen: Dispatch<SetStateAction<string>>;
}

export type { StartAKB };
