import { TextareaHTMLAttributes } from "react";
import classes from "./Textarea.module.css";

const Textarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={classes.textarea} spellCheck={false} />
);

export default Textarea;
