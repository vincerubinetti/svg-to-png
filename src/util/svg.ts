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
  options?: ProcessingOptions,
) => {
  const svg = await sourceToSvg(
    source,
    /**
     * use less strict html type (allows things like missing xmlns) because
     * browser can still handle drawing it to canvas
     */
    "text/html",
  );
  processSvg(svg, options);
  return await svgToImage(svg);
};

/** svg namespace */
const ns = "http://www.w3.org/2000/svg";

/** convert svg source code to svg dom object */
export const sourceToSvg = async (
  source: string,
  type: DOMParserSupportedType = "image/svg+xml",
) => {
  /** parse source as document */
  const document = new DOMParser().parseFromString(source, type);
  /** get svg element */
  const svg = document.querySelector("svg");

  /** element for displaying xml parsing error */
  let error = document.querySelector("parsererror")?.textContent || "";
  /** remove unhelpful bits of error message */
  [
    "This page contains the following errors:",
    "Below is a rendering of the page up to the first error.",
  ].forEach((phrase) => (error = error.replace(phrase, "")));
  if (error) throw Error(error);

  if (!svg) throw Error("No root SVG element");

  return svg;
};

/** derive computed properties from svg input file, e.g. sizes */
export const svgProps = async (
  source: string,
  filename: string,
  options?: ProcessingOptions,
) => {
  let errorMessage = "";

  const handleError = (error: unknown) => {
    if (typeof error === "string") errorMessage += error;
    if (error instanceof Error) errorMessage += error.message;
    errorMessage += "\n";
  };

  let svg: SVGSVGElement | undefined;

  /** try to convert source to svg and capture errors */
  try {
    svg = await sourceToSvg(
      source,
      /** use stricter svg type to get more helpful parse errors */
      "image/svg+xml",
    );
  } catch (error) {
    handleError(error);
  }

  /** try to convert source to image and capture errors */
  try {
    await sourceToImage(source);
  } catch (error) {
    handleError(error);
  }

  /** collapse error whitespace */
  errorMessage = errorMessage.replaceAll(/\n+/g, "\n");

  /** final inferred size of image */
  const size = {
    /** fallback size */
    width: 100,
    height: 100,
  };

  const { specified, absolute, viewBox, contents, contentsStrokes } =
    processSvg(svg, options);

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
    name: filename.replace(/\.svg$/i, "") || "image",
    errorMessage,
    specified,
    absolute,
    viewBox,
    size,
    contents,
    contentsStrokes,
  };
};

/** options for procesing svg */
type ProcessingOptions = {
  trim?: boolean;
  color?: string;
};

/** modify svg (in place) and return details */
const processSvg = (
  svg?: SVGSVGElement,
  { trim = false, color = "" }: ProcessingOptions = {},
) => {
  /** size exactly as specified in svg source attributes */
  const specified = {
    width: svg?.getAttribute("width") || "",
    height: svg?.getAttribute("height") || "",
  };

  /** specified size converted to pixels */
  const absolute = {
    width: unitsToPixels(specified.width),
    height: unitsToPixels(specified.height),
  };

  /** view box attribute, parsed */
  const viewBox = (() => {
    const [x = 0, y = 0, width = 0, height = 0] = (
      svg?.getAttribute("viewBox") || ""
    )
      .split(/\s/)
      .map(parseFloat)
      .map((value) => (isNaN(value) ? undefined : value));
    return { x, y, width, height };
  })();

  /** attach svg to document to get defined bbox */
  if (svg) window.document.body.append(svg);

  /** get view box of contents */
  const contents = (() => {
    const { x = 0, y = 0, width = 0, height = 0 } = svg?.getBBox() || {};
    /** get as plain object, for serialization */
    return { x, y, width, height };
  })();

  /** get view box of contents plus strokes */
  const contentsStrokes = { ...contents };

  /** get stroke widths of all children */
  const strokeWidths = [...(svg?.querySelectorAll("*") || [])].map(
    (element) => {
      const style = window.getComputedStyle(element);
      if (style.stroke === "none") return 0;
      return parseFloat(style.strokeWidth || "0") || 0;
    },
  );

  /** remove svg from document */
  if (svg) window.document.body.removeChild(svg);

  /** get amount to expand viewBox to at least avoid cutting off strokes */
  const margin = Math.max(...strokeWidths) / 2;

  /** expand viewBox */
  contentsStrokes.x -= margin;
  contentsStrokes.y -= margin;
  contentsStrokes.width += 2 * margin;
  contentsStrokes.height += 2 * margin;

  /** trim viewBox to contents */
  if (trim) {
    const { x, y, width, height } = contentsStrokes;
    svg?.setAttribute("viewBox", [x, y, width, height].join(" "));
  }

  /** set currentColor */
  if (color.startsWith("~"))
    svg?.setAttribute("color", color.replace(/^~/, ""));
  else if (color) {
    /** apply color tint with inner svg filter */
    const id = getFilterId();

    /** filter element */
    const filter = document.createElementNS(ns, "filter");
    filter.setAttribute("id", id);

    /** flood element */
    const flood = document.createElementNS(ns, "feFlood");
    flood.setAttribute("flood-color", color);
    flood.setAttribute("result", "flood");

    /** composite element */
    const composite = document.createElementNS(ns, "feComposite");
    composite.setAttribute("operator", "in");
    composite.setAttribute("in", "flood");
    composite.setAttribute("in2", "SourceAlpha");

    /** append elements */
    filter.append(flood);
    filter.append(composite);

    /** put filter within svg */
    svg?.append(filter);

    /** apply inner filter to root svg element (doesn't work in firefox) */
    svg?.setAttribute("filter", `url(#${id})`);
  }

  return { specified, absolute, viewBox, contents, contentsStrokes };
};

/** get pseudo-unique id for filter */
export const getFilterId = () => "filter-" + String(Math.random()).slice(2);
