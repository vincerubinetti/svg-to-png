/** toFixed, except limited to number of decimal places needed */
export const toFixed = (value: number, places: number) =>
  String(Number(Number(value).toFixed(places)));
