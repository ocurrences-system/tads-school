import React from "react";
import clsx from "clsx";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "warning" | "success";
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  const variantClasses = clsx(
    "inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium",
    {
      "bg-gray-100 text-gray-800": variant === "default",
      "bg-red-100 text-red-800": variant === "destructive",
      "bg-yellow-100 text-yellow-800": variant === "warning",
      "bg-green-100 text-green-800": variant === "success",
    }
  );

  return <span className={variantClasses}>{children}</span>;
}