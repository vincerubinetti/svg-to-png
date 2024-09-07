import type { ComponentProps } from "react";
import classes from "./Button.module.css";

const Button = (props: ComponentProps<"button">) => (
  <button {...props} className={classes.button} />
);

export default Button;
