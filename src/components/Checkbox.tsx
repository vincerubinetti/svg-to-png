import classes from "./Checkbox.module.css";

type Props = {
  label: string;
  tooltip?: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

const Checkbox = ({ label, tooltip, value, onChange }: Props) => (
  <label className="control" data-tooltip={tooltip}>
    <span className="control-label">{label}</span>
    <input
      type="checkbox"
      checked={value}
      onChange={(event) => onChange(event.target.checked)}
      className={classes.input}
    />
  </label>
);

export default Checkbox;
