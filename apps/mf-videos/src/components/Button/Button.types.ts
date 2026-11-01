import type { ComponentProps } from "react";

export type ButtonProps = ComponentProps<"button"> & {
  isLoading?: boolean;
};
