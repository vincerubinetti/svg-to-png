/** format number to string */
export const formatNumber = (value: number | undefined, compact = false) => {
  if (value === undefined) return "-";
  if (Math.abs(value) < 0.01 && value) return value.toExponential(1);
  const options: Intl.NumberFormatOptions = {};
  if (compact) options.notation = "compact";
  options.maximumFractionDigits = compact ? 1 : 2;
  return value.toLocaleString(undefined, options).toLowerCase();
};
