import { InputHTMLAttributes, ReactNode } from "react";
import classes from "./Checkbox.module.css";

type Props = {
  label?: ReactNode;
  tooltip?: string;
  value: boolean;
  onChange: (value: boolean) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

const Checkbox = ({ label, tooltip, value, onChange, ...props }: Props) => (
  <label className="control" data-tooltip={tooltip}>
    {label && <span className="control-label">{label}</span>}
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
