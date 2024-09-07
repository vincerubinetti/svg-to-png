import type { ComponentProps } from "react";
import classes from "./Numberbox.module.css";

type Props = {
  label?: string;
  tooltip?: string;
  value: number;
  onChange: (value: number) => void;
} & Omit<ComponentProps<"input">, "value" | "onChange">;

const Numberbox = ({ label, tooltip, value, onChange, ...props }: Props) => (
  <label className="control" data-tooltip={tooltip}>
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
