import { InputHTMLAttributes } from "react";
import classes from "./Range.module.css";

type Props = {
  label?: string;
  tooltip?: string;
  value: number;
  onChange: (value: number) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

const Range = ({ label, tooltip, value, onChange, ...props }: Props) => (
  <label className="control" data-tooltip={tooltip}>
    {label && <span className="control-label">{label}</span>}
    <input
      type="number"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className={classes.input}
      {...props}
    />
  </label>
);

export default Range;
