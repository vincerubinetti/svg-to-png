import { ButtonHTMLAttributes } from "react";
import classes from "./Button.module.css";

const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className={classes.button} />
);

export default Button;
