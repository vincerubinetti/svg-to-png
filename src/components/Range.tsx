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

export default Range;
