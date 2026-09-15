import type { ComponentProps } from "react";
import { clsx } from "clsx";

export default function Button({
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={clsx(
        "min-h-10 min-w-10 gap-2 rounded-md bg-light-gray p-2 hover:bg-theme hover:text-white",
        className,
      )}
    />
  );
}
