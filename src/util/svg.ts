/** convert string of absolute css units to pixels */
export const unitsToPixels = (string: string) => {
  /** unit constants https://www.w3.org/TR/css-values-3/#absolute-lengths */
  const units: Record<string, number> = {
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

/** options for parsing source as svg/image */
type SourceOptions = {
  type?: DOMParserSupportedType;
  trim?: boolean;
  color?: string;
};

/** convert svg element to image object */
export const svgToImage = async (svg: SVGSVGElement) => {
  /** encode svg as data url */
  const url =
    "data:image/svg+xml;charset=utf8," +
    encodeURIComponent(new XMLSerializer().serializeToString(svg));
  return (await urlToImage(url)) || null;
};

/** convert svg source code to image object */
export const sourceToImage = async (
  source: string,
  options?: SourceOptions,
) => {
  /**
   * use less strict html type (allows things like missing xmlns) because
   * browser can still handle drawing it as image on canvas
   */
  const svg = await sourceToSvg(source, { ...options, type: "text/html" });
  return await svgToImage(svg);
};

/** svg namespace */
const ns = "http://www.w3.org/2000/svg";

/** convert svg source code to svg dom object */
export const sourceToSvg = async (
  source: string,
  { type = "image/svg+xml", trim = false, color = "" }: SourceOptions = {},
) => {
  /** parse source as document */
  const doc = new DOMParser().parseFromString(source, type);
  /** get svg element */
  const svg = doc.querySelector("svg");

  /** element for displaying xml parsing error */
  let error = doc.querySelector("parsererror")?.textContent || "";
  /** remove unhelpful bits of error message */
  [
    "This page contains the following errors:",
    "Below is a rendering of the page up to the first error.",
  ].forEach((phrase) => (error = error.replace(phrase, "")));
  if (error) throw Error(error);

  if (!svg) throw Error("No root SVG element");

  /** trim viewBox to contents */
  if (trim) {
    /** attach svg to document to get defined bbox */
    window.document.body.append(svg);

    /**
     * get rough bbox (doesn't account for strokes/markers/etc, getBbox options
     * not supported by most browsers)
     */
    let { x, y, width, height } = svg.getBBox();

    /** get stroke widths of all children */
    const strokeWidths = [...svg.querySelectorAll("*")].map((element) =>
      parseFloat(window.getComputedStyle(element).strokeWidth || "0"),
    );

    /** get amount to expand viewBox to at least avoid cutting off strokes */
    const margin = Math.max(...strokeWidths) / 2;

    /** expand viewBox */
    x -= margin;
    y -= margin;
    width += 2 * margin;
    height += 2 * margin;

    /** remove svg from document */
    window.document.body.removeChild(svg);

    /** trim svg to rough bbox */
    svg.setAttribute("viewBox", [x, y, width, height].join(" "));
  }

  /** set currentColor */
  if (color.startsWith("~")) {
    svg.setAttribute("color", color.replace(/^~/, ""));
  } else if (color) {
    /** apply svg-wide color. implement using filter as catch-all. */

    /** avoid collision with any user ids */
    const id = "colorize-" + String(Math.random()).slice(2);

    /** filter element */
    const filter = doc.createElementNS(ns, "filter");
    filter.setAttribute("id", id);

    /** flood element */
    const flood = doc.createElementNS(ns, "feFlood");
    flood.setAttribute("flood-color", color);
    flood.setAttribute("result", "flood");

    /** composite element */
    const composite = doc.createElementNS(ns, "feComposite");
    composite.setAttribute("operator", "in");
    composite.setAttribute("in", "flood");
    composite.setAttribute("in2", "SourceAlpha");

    /** append elements */
    filter.append(flood);
    filter.append(composite);
    svg.append(filter);

    /**
     * apply filter to all top-level children. can't apply to root svg element
     * because of firefox.
     */
    svg
      .querySelectorAll(":scope > *")
      .forEach((child) => child.setAttribute("filter", `url(#${id})`));
  }

  return svg;
};

/** derive computed properties from svg input file, e.g. sizes */
export const svgProps = async (source: string, options?: SourceOptions) => {
  let errorMessage = "";

  /** svg dom object */
  let svg = null;

  /** util for handling source conversion errors */
  const handleError = (error: unknown) => {
    if (typeof error === "string") errorMessage += error;
    if (error instanceof Error) errorMessage += error.message;
    errorMessage += "\n";
  };

  /** try to convert source to svg and capture parsing errors */
  try {
    /** use stricter type to get more helpful svg spec parse errors */
    svg = await sourceToSvg(source, { ...options, type: "image/svg+xml" });
  } catch (error) {
    handleError(error);
  }

  /** try to convert source to image and capture error */
  try {
    await sourceToImage(source, { type: "image/svg+xml" });
  } catch (error) {
    handleError(error);
  }

  /** collapse error whitespace */
  errorMessage = errorMessage.replaceAll(/\n+/g, "\n");

  /** sizes, exactly as specified in svg source */
  const specified = {
    width: svg?.getAttribute("width") || "",
    height: svg?.getAttribute("height") || "",
  };

  /** specified sizes converted to pixels */
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

  /** final inferred size of image */
  const size = {
    /** fallback size */
    width: 512,
    height: 512,
  };

  if (absolute.width && absolute.height) {
    /** use absolute if available */
    size.width = absolute.width;
    size.height = absolute.height;
  } else if (absolute.width && viewBox.width && viewBox.height) {
    /** if only width specified, calc height from view box aspect */
    size.width = absolute.width;
    size.height = absolute.width * (viewBox.height / viewBox.width);
  } else if (absolute.height && viewBox.width && viewBox.height) {
    /** if only height specified, calc width from view box aspect */
    size.width = absolute.height * (viewBox.width / viewBox.height);
    size.height = absolute.height;
  } else if (viewBox.width && viewBox.height) {
    /** use view box if available */
    size.width = viewBox.width;
    size.height = viewBox.height;
  } else if (absolute.width) {
    /** use absolute width for both */
    size.width = absolute.width;
    size.height = absolute.width;
  } else if (absolute.height) {
    /** use absolute height for both */
    size.width = absolute.height;
    size.height = absolute.height;
  } else if (viewBox.width) {
    /** use viewBox width for both */
    size.width = viewBox.width;
    size.height = viewBox.width;
  } else if (viewBox.height) {
    /** use viewBox height for both */
    size.width = viewBox.height;
    size.height = viewBox.height;
  }

  return {
    errorMessage,
    specified,
    absolute,
    viewBox,
    size,
  };
};

/** remove svg extension */
export const removeExt = (filename: string) => filename.replace(/\.svg$/i, "");
