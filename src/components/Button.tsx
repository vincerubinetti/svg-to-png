import type { ComponentProps } from "react";
import { clsx } from "clsx";
import classes from "./Button.module.css";

const Button = ({ className, ...props }: ComponentProps<"button">) => (
  <button {...props} className={clsx(classes.button, className)} />
);

export default Button;
