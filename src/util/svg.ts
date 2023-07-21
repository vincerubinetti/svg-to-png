import { capitalize } from "lodash";
import { toFixed } from "@/util/math";

/** convert string of absolute css units to pixels */
export const unitsToPixels = (string: string) => {
  /** unit constants https://www.w3.org/TR/css-values-3/#absolute-lengths */
  const units: { [key: string]: number } = {
    px: 1,
    in: 96,
    pc: 96 / 6,
    pt: 96 / 72,
    cm: 96 / 2.54,
    mm: 96 / 2.54 / 10,
    q: 96 / 2.54 / 40,
  };

  /** extract number and unit */
  const [, stringValue, unit] = string.match(/(\d+\.?\d*)\s*(\w*)/) || [];

  /** parse value as number */
  let value = Number(stringValue || 0);

  /** multiply value by unit constant */
  value *= units[(unit || "px").toLowerCase()] || 0;

  return value;
};

/** load url as image object */
const urlToImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () =>
      reject("Couldn't convert SVG to image element"),
    );
    image.src = url;
  });

/** convert svg source code to image dom object */
export const sourceToImage = async (source: string) => {
  /** use less strict html type (allows things like missing xmlns)
   * because browser can still handle drawing it as image on canvas */
  const svg = sourceToSvg(source, "text/html");
  /** encode svg as data url */
  const url =
    "data:image/svg+xml;charset=utf8," +
    encodeURIComponent(new XMLSerializer().serializeToString(svg));
  return (await urlToImage(url)) || null;
};

/** convert svg source code to svg dom object */
export const sourceToSvg = (
  source: string,
  /** use stricter type by default to get more helpful svg spec parse errors */
  type: DOMParserSupportedType = "image/svg+xml",
) => {
  const doc = new DOMParser().parseFromString(source, type);
  const svg = doc.querySelector("svg");
  /** element for displaying xml parsing error */
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

/** derive computed properties from svg input file, e.g. dimensions */
export const svgProps = async (source: string, filename: string) => {
  let errorMessage = "";

  /** svg dom object, for convenient parsing */
  let svg = null;
  /** image dom object, for convenient drawing */
  let image = null;

  /** util for handling source parse errors */
  const handleError = (error: unknown) => {
    if (typeof error === "string") errorMessage += error;
    if (error instanceof Error) errorMessage += error.message;
    errorMessage += "\n";
  };

  /** parse source as svg */
  try {
    svg = sourceToSvg(source);
  } catch (error) {
    handleError(error);
  }

  /** parse source as image */
  try {
    image = await sourceToImage(source);
  } catch (error) {
    handleError(error);
  }

  /** collapse error whitespace */
  errorMessage = errorMessage.replaceAll(/\n+/g, "\n");

  /** filename without extension */
  const name = filename.replace(/\.svg$/, "");

  /** dimensions, exactly as specified in svg source */
  const specified = {
    width: svg?.getAttribute("width") || "",
    height: svg?.getAttribute("height") || "",
  };

  /** specified dimensions converted to pixels */
  const absolute = {
    width: unitsToPixels(specified.width),
    height: unitsToPixels(specified.height),
  };

  /** read viewBox attribute from svg source */
  const [x = 0, y = 0, width = 0, height = 0] = (
    svg?.getAttribute("viewBox") || ""
  )
    .split(/\s/)
    .map(parseFloat);
  /** viewBox, exactly as specified in svg source */
  const viewBox = { x, y, width, height };

  /** final inferred dimensions of image */
  const inferred = {
    /** fallback dimensions */
    width: 512,
    height: 512,
  };

  if (absolute.width && absolute.height) {
    /** use absolute if available */
    inferred.width = absolute.width;
    inferred.height = absolute.height;
  } else if (absolute.width && viewBox.width && viewBox.height) {
    /** if only width specified, calc height from view box aspect */
    inferred.width = absolute.width;
    inferred.height = absolute.width * (viewBox.height / viewBox.width);
  } else if (absolute.height && viewBox.width && viewBox.height) {
    /** if only height specified, calc width from view box aspect */
    inferred.width = absolute.height * (viewBox.width / viewBox.height);
    inferred.height = absolute.height;
  } else if (viewBox.width && viewBox.height) {
    /** use view box if available */
    inferred.width = viewBox.width;
    inferred.height = viewBox.height;
  } else if (absolute.width) {
    /** use absolute width for both */
    inferred.width = absolute.width;
    inferred.height = absolute.width;
  } else if (absolute.height) {
    /** use absolute height for both */
    inferred.width = absolute.height;
    inferred.height = absolute.height;
  } else if (viewBox.width) {
    /** use viewBox width for both */
    inferred.width = viewBox.width;
    inferred.height = viewBox.width;
  } else if (viewBox.height) {
    /** use viewBox height for both */
    inferred.width = viewBox.height;
    inferred.height = viewBox.height;
  }

  /** dimension info table html */
  const info = `
    <table>
      <tr>
        <td>Specified</td>
        <td>
          ${specified.width || "-"}</td>
        <td>×</td>
        <td>
          ${specified.height || "-"}</td>
      </tr>
      <tr>
        <td>Absolute</td>
        <td>
          ${absolute.width ? toFixed(absolute.width, 2) + "px" : "-"}
        </td>
        <td>×</td>
        <td>
          ${absolute.height ? toFixed(absolute.height, 2) + "px" : "-"}
        </td>
      </tr>
      <tr>
        <td>View Box</td>
        <td>
          ${viewBox.width ? toFixed(viewBox.width, 2) : "-"}
        </td>
        <td>×</td>
        <td>
          ${viewBox.height ? toFixed(viewBox.height, 2) : "-"}
        </td>
      </tr>
      <tr>
        <td>Inferred</td>
        <td>
          ${inferred.width ? toFixed(inferred.width, 2) + "px" : "-"}
        </td>
        <td>×</td>
        <td>
          ${inferred.height ? toFixed(inferred.height, 2) + "px" : "-"}
        </td>
      </tr>
    </table>
  `;

  return {
    errorMessage,
    svg,
    image,
    name,
    specified,
    absolute,
    viewBox,
    inferred,
    info,
  };
};
