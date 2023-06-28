/** convert string of CSS units -- 4in, 200mm, etc. -- to pixels */
export const unitsToPixels = (string: string) => {
  string = string || "";
  /** unit constants */
  const ppi = 96;
  const units: { [key: string]: number } = {
    ch: 8,
    ex: 7.15625,
    em: 16,
    rem: 16,
    in: ppi,
    cm: ppi / 2.54,
    mm: ppi / 25.4,
    pt: ppi / 72,
    pc: ppi / 6,
    px: 1,
  };
  /** get number */
  let value = parseFloat(string) || 0;
  /** get unit */
  const unit = string.replace(String(value), "").trim();
  /** multiply value by unit constant */
  value *= units[unit] || 1;
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
