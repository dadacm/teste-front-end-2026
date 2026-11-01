import type { ComponentProps, ReactNode } from "react";

type BaseButtonProps = Omit<ComponentProps<"button">, "children"> & {
  isLoading?: boolean;
  loadingText?: string;
};

type DefaultButtonProps = BaseButtonProps & {
  variant?: "default";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
};

type IconOnlyButtonProps = BaseButtonProps & {
  variant: "icon-only";
  icon: ReactNode;
  "aria-label": string;
  iconPosition?: never;
  children?: never;
};

export type ButtonProps = DefaultButtonProps | IconOnlyButtonProps;
