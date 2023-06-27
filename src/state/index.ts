import { atom, getDefaultStore } from "jotai";
import { loadable } from "jotai/utils";
import { cloneDeep, isEqual } from "lodash";
import { sourceToImage, sourceToSvg, unitsToPixels } from "@/util/svg";

type Input = { name: string; source: string };

/** sample file */
const sampleFile: Input = {
  name: "sample.svg",
  source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100">\n  <circle fill="#e91e63" cx="0" cy="0" r="35" />\n</svg>\n`,
};

/** list of inputted svg files */
export const files = atom([sampleFile]);

/** default dimensions */
export const defaultWidth = 200;
export const defaultHeight = 200;

/** list of computed props from files */
export const computed = loadable(
  atom(
    async (get) =>
      await Promise.all(
        get(files).map(async (file) => {
          let errorMessage = "";

          /** svg dom object, for convenient parsing */
          let svg = null;
          /** image dom object, for convenient drawing */
          let image = null;

          try {
            svg = sourceToSvg(file.source);
            image = await sourceToImage(file.source);
          } catch (error) {
            if (typeof error === "string") errorMessage = error;
            if (error instanceof Error) errorMessage = error.message;
          }

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

          /** resulting dimensions */
          const dimensions = {
            width: absolute.width || viewBox.width || defaultWidth,
            height: absolute.height || viewBox.height || defaultHeight,
          };

          /** remove unhelpful bits of error message */
          [
            "This page contains the following errors:",
            "Below is a rendering of the page up to the first error.",
          ].forEach(
            (phrase) => (errorMessage = errorMessage.replace(phrase, ""))
          );

          return {
            errorMessage,
            svg,
            image,
            specified,
            absolute,
            viewBox,
            dimensions,
          };
        })
      )
  )
);

/** singleton store instance to access state outside of react */
const store = getDefaultStore();

/** add files to file list */
export const addFiles = (toAdd: Input[]) => {
  let newFiles = cloneDeep(store.get(files));
  if (isEqual(newFiles, [sampleFile])) newFiles = [];
  newFiles = newFiles.concat(toAdd);
  store.set(files, newFiles);
};

/** remove file from file list */
export const removeFile = (index: number) => {
  const newFiles = cloneDeep(store.get(files));
  newFiles.splice(index, 1);
  store.set(files, newFiles);
};

/** reset file list to just sample file */
export const clearFiles = () => store.set(files, []);
