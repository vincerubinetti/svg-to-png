import { capitalize } from "lodash";

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

/** load url as image object */
const urlToImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () =>
      reject("Couldn't convert SVG to image element")
    );
    image.src = url;
  });

/** convert svg source code to image dom object */
export const sourceToImage = async (source: string) => {
  const url =
    "data:image/svg+xml;charset=utf8," +
    encodeURIComponent(
      new XMLSerializer().serializeToString(
        sourceToSvg(
          source,
          /** use less strict html type (allows things like missing xmlns)
           * because browser can still handle drawing it as image on canvas */
          "text/html"
        )
      )
    );
  const image = (await urlToImage(url)) || null;
  return image;
};

/** convert svg source code to svg dom object */
export const sourceToSvg = (
  source: string,
  /** use stricter type by default to get more helpful svg spec parse errors */
  type: DOMParserSupportedType = "image/svg+xml"
) => {
  const doc = new DOMParser().parseFromString(source, type);
  const svg = doc.querySelector("svg");
  let error = doc.querySelector("parsererror")?.textContent || "";
  /** remove unhelpful bits of error message */
  [
    "This page contains the following errors:",
    "Below is a rendering of the page up to the first error.",
  ].forEach((phrase) => (error = error.replace(phrase, "")));
  error = capitalize(error);
  if (error) throw Error(error);
  if (svg) return svg;
  throw Error("No root SVG element");
};
