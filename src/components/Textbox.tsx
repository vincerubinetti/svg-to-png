import { InputHTMLAttributes } from "react";
import classes from "./Textbox.module.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

const Textbox = ({ value, onChange, ...props }: Props) => (
  <input
    type="text"
    {...props}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className={classes.textbox}
  />
);

export default Textbox;
