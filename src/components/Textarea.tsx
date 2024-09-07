import type { ComponentProps } from "react";
import classes from "./Textarea.module.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
} & Omit<ComponentProps<"textarea">, "value" | "onChange">;

const Textarea = ({ value, onChange, ...props }: Props) => (
  <textarea
    className={classes.textarea}
    spellCheck={false}
    {...props}
    value={value}
    onChange={(event) => onChange(event.target.value)}
  />
);

export default Textarea;
