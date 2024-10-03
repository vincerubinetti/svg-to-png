import type { ComponentProps } from "react";
import clsx from "clsx";
import classes from "./Numberbox.module.css";

type Props = {
  label?: string;
  tooltip?: string;
  value: number;
  onChange: (value: number) => void;
} & Omit<ComponentProps<"input">, "value" | "onChange">;

const Numberbox = ({
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
      type="number"
      className={classes.input}
      {...props}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </label>
);

export default Numberbox;
