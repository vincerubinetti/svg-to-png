import type { ComponentProps } from "react";
import classes from "./Textbox.module.css";

type Props = {
  label?: string;
  tooltip?: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<ComponentProps<"input">, "value" | "onChange">;

const Textbox = ({ label, tooltip, value, onChange, ...props }: Props) => (
  <label className={classes.label + " control"} data-tooltip={tooltip}>
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
