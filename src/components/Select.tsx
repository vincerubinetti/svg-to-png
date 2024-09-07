import type { ComponentProps } from "react";
import { startCase } from "lodash";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./Select.module.css";

type Props<Option> = {
  label?: string;
  tooltip?: string;
  options: Option[];
  value: Option;
  onChange: (value: Option) => void;
} & Omit<ComponentProps<"select">, "value" | "onChange">;

const Select = <Option extends string>({
  label,
  tooltip,
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  ...props
}: Props<Option>) => (
  <label
    className={classes.label + " control"}
    data-tooltip={tooltip}
    aria-label={ariaLabel}
  >
    {label && <span>{label}</span>}
    <select
      className={classes.select}
      {...props}
      value={value}
      onChange={(event) => onChange(options[event.target.selectedIndex])}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {startCase(option)}
        </option>
      ))}
    </select>
    <FontAwesomeIcon icon={faCaretDown} className={classes.caret} />
  </label>
);

export default Select;
