import { InputHTMLAttributes } from "react";
import classes from "./Textbox.module.css";

type Props = {
  label?: string;
  tooltip?: string;
  value: string;
  onChange: (value: string) => void;
  resizable?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

const Textbox = ({
  label,
  tooltip,
  value,
  onChange,
  resizable,
  ...props
}: Props) => (
  <label
    className={classes.label + " control"}
    data-tooltip={tooltip}
    data-resizable={resizable}
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
