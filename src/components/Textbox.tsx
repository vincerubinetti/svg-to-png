import type { ComponentProps } from "react";
import clsx from "clsx";
import classes from "./Textbox.module.css";

type Props = {
  label?: string;
  tooltip?: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<ComponentProps<"input">, "value" | "onChange">;

const Textbox = ({
  label,
  tooltip,
  value,
  onChange,
  className,
  ...props
}: Props) => (
  <label
    className={clsx("control", classes.label, className)}
    data-tooltip={tooltip}
  >
    {label && <span>{label}</span>}
    <input
      type="text"
      className={classes.input}
      {...props}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>
);

export default Textbox;
