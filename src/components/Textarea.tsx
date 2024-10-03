import type { ComponentProps } from "react";
import clsx from "clsx";
import classes from "./Textarea.module.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
} & Omit<ComponentProps<"textarea">, "value" | "onChange">;

const Textarea = ({ value, onChange, className, ...props }: Props) => (
  <textarea
    className={clsx(classes.textarea, className)}
    spellCheck={false}
    {...props}
    value={value}
    onChange={(event) => onChange(event.target.value)}
  />
);

export default Textarea;
