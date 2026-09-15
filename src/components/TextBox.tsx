import type { ComponentProps } from "react";
import clsx from "clsx";

type Props = {
  multi?: boolean;
  value: string;
  onChange: (value: string) => void;
} & Omit<ComponentProps<"input">, "value" | "onChange"> &
  Omit<ComponentProps<"textarea">, "value" | "onChange">;

export default function TextBox({
  multi,
  value,
  onChange,
  className,
  ...props
}: Props) {
  const Component = multi ? "textarea" : "input";

  return (
    <Component
      className={clsx(
        "min-h-10 w-0 min-w-48 rounded-md border border-gray p-2 hover:border-theme",
        Component === "textarea" && "font-mono",
        className,
      )}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      {...props}
    />
  );
}
