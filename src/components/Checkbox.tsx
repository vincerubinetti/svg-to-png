import type { ComponentProps, ReactNode } from "react";
import classes from "./Checkbox.module.css";

type Props = {
  label?: ReactNode;
  tooltip?: string;
  value: boolean;
  onChange: (value: boolean) => void;
} & Omit<ComponentProps<"input">, "value" | "onChange">;

const Checkbox = ({ label, tooltip, value, onChange, ...props }: Props) => (
  <label className="control" data-tooltip={tooltip}>
    {label && <span>{label}</span>}
    <input
      type="checkbox"
      className={classes.input}
      {...props}
      checked={value}
      onChange={(event) => onChange(event.target.checked)}
    />
  </label>
);

export default Checkbox;
