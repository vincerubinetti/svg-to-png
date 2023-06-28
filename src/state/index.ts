import { atom, getDefaultStore } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { unstable_unwrap } from "jotai/utils";
import { isEqual, range } from "lodash";
import { sourceToImage, sourceToSvg, unitsToPixels } from "@/util/svg";

type File = {
  name: string;
  source: string;
};

type Option = {
  width: number;
  height: number;
  aspect: number;
  margin: number;
};

const sampleFile: File = {
  name: "sample.svg",
  source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">\n  <circle fill="#e91e63" cx="0" cy="0" r="100" />\n</svg>`,
};

/** list of inputted svg files */
export const files = atomWithImmer([sampleFile]);

/** default dimensions */
export const defaultWidth = 512;
export const defaultHeight = 512;

/** props computed/derived from input files */
export const computed = unstable_unwrap(
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

          /** filename, without extension */
          const name = file.name.replace(/\.svg$/, "");

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
            name,
            specified,
            absolute,
            viewBox,
            dimensions,
          };
        })
      ),
    (prev) => prev ?? null
  )
);

/** list of options for rendering */
export const options = atomWithImmer<Option[]>([]);

/** singleton store instance to access state outside of react */
const store = getDefaultStore();

/** set options from files */
store.sub(computed, () =>
  store.set(
    options,
    store.get(computed)?.map((computed) => ({
      width: computed.dimensions.width,
      height: computed.dimensions.height,
      aspect: computed.dimensions.width / computed.dimensions.height,
      margin: 0,
    })) || []
  )
);

/** set arbitrary file field */
export const setFile = <Key extends keyof File>(
  /** which options set in list to set */
  index: number,
  /** which field to set */
  key: Key,
  /** value to set field to */
  value: File[Key]
) =>
  store.set(files, (newFiles) => {
    newFiles[index][key] = value;
  });

/** set arbitrary option field */
export const setOption = <Key extends keyof Option>(
  /** which options set in list to set. -1 to set all. */
  index: number,
  /** which field to set */
  key: Key,
  /** value to set field to */
  value: Option[Key]
) =>
  store.set(options, (newOptions) => {
    /** list of list items to set */
    const indices = index === -1 ? range(store.get(options).length) : [index];

    for (const index of indices) {
      /** update value */
      newOptions[index][key] = value;

      /** lock aspect ratio */
      if (key === "aspect" && value === Infinity)
        newOptions[index].aspect =
          newOptions[index].width / newOptions[index].height;

      /** preserve aspect ratio */
      if (key === "width" && newOptions[index].aspect)
        newOptions[index].height =
          newOptions[index].width / newOptions[index].aspect;
      if (key === "height" && newOptions[index].aspect)
        newOptions[index].width =
          newOptions[index].height * newOptions[index].aspect;
    }
  });

/** add files to file list */
export const addFiles = (toAdd: File[]) =>
  store.set(files, (newFiles) =>
    isEqual(newFiles, [sampleFile]) ? toAdd : newFiles.concat(toAdd)
  );

/** remove file from file list */
export const removeFile = (index: number) =>
  store.set(files, (newFiles) => {
    newFiles.splice(index, 1);
  });

/** reset file list to just sample file */
export const clearFiles = () => store.set(files, []);
