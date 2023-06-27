import { InputHTMLAttributes } from "react";
import classes from "./Textbox.module.css";

const Textbox = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input type="text" {...props} className={classes.textbox} />
);

export default Textbox;
