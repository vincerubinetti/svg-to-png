/** convert string of absolute css units to pixels */
export const unitsToPixels = (string: string) => {
  /** unit constants https://www.w3.org/TR/css-values-3/#absolute-lengths */
  const units: { [key: string]: number } = {
    px: 1,
    in: 96,
    pt: 96 / 72,
    pc: 96 / 6,
    cm: 96 / 2.54,
    mm: 96 / 2.54 / 10,
    q: 96 / 2.54 / 40,
  };

  /** extract number and unit */
  const [, stringValue = "0", unit = "px"] =
    string.match(/(\d+\.?\d*)\s*(\w*)/) || [];

  /** parse value as number */
  let value = Number(stringValue);

  /** multiply value by unit constant */
  value *= units[unit.toLowerCase()] || 0;
  return value;
};

/** load URI as image object, as an async-await-able function */
const urlToImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () =>
      reject("Couldn't convert SVG to image")
    );
    image.src = url;
  });

/** convert svg source code to image dom object */
export const sourceToImage = async (source: string) => {
  const blob = new Blob([source || ""], { type: "image/svg+xml" });
  const image = (await urlToImage(URL.createObjectURL(blob))) || null;
  URL.revokeObjectURL(image.src);
  return image;
};

/** convert svg source code to svg dom object */
export const sourceToSvg = (source: string) => {
  const doc = new DOMParser().parseFromString(source, "image/svg+xml");
  const svg = doc.querySelector("svg");
  const error = doc.querySelector("parsererror");
  if (error) throw new Error(String(error.textContent));
  if (svg) return svg;
  throw new Error("unknown error");
};
