import { atomWithStorage } from "jotai/utils";
import { cloneDeep, isEqual, range } from "lodash";
import { getAtom, setAtom } from "@/util/atoms";
import { svgProps } from "@/util/svg";

/** input file */
type File = { source: string; filename: string };

/** computed/derived props from input file */
type Props = Awaited<ReturnType<typeof svgProps>>;

/** options for output */
type Options = ReturnType<typeof getDefaultOptions>;

/** full image object */
export type Image = File & Props & Options;

/** list of images */
export const imagesAtom = atomWithStorage<Image[]>("images", []);

/** add images to list */
export const addImages = async (newFiles: File[]) => {
  const newImages = cloneDeep(getAtom(imagesAtom));

  /** expand provided new files into full images */
  const results: Image[] = await Promise.all(
    newFiles.map(async (file) => {
      const { trim } = getDefaultOptions();
      const props = await svgProps(file.source, file.filename, { trim });
      const options = getDefaultOptions(props);
      return { ...file, ...props, ...options };
    }),
  );

  /** append to end */
  newImages.push(...results);

  setAtom(imagesAtom, newImages);
};

/** set arbitrary field on image */
export const setImage = async <Key extends keyof Image>(
  /** image number to set. -1 to set all. */
  index: number,
  /** field to set */
  key: Key,
  /** value to set */
  value: Image[Key],
) => {
  let newImages = cloneDeep(getAtom(imagesAtom));

  /** list of indices to set */
  const indices = index === -1 ? range(newImages.length) : [index];

  /** set as much as possible synchronously first to preserve text box cursors */
  /** https://stackoverflow.com/questions/46000544/react-controlled-input-cursor-jumps#comment126597443_48608293 */
  for (const index of indices) {
    const newImage = newImages[index];
    if (!newImage) continue;

    /** update value */
    newImage[key] = value;

    /** lock aspect ratio */
    if (key === "aspectLock" && value === Infinity)
      newImage.aspectLock = newImage.width / newImage.height;

    /** preserve aspect ratio */
    if (key === "width" && newImage.aspectLock)
      newImage.height = newImage.width / newImage.aspectLock;
    if (key === "height" && newImage.aspectLock)
      newImage.width = newImage.height * newImage.aspectLock;
  }

  /** set sync changes */
  setAtom(imagesAtom, newImages);

  /** re-clone so second store set works */
  newImages = cloneDeep(newImages);

  if (["source", "filename", "trim"].includes(key)) {
    for (const index of indices) {
      const newImage = newImages[index];
      if (!newImage) continue;

      const oldSize = newImage.size;

      /** update computed props */
      const props = await svgProps(newImage.source, newImage.filename, {
        trim: newImage.trim,
      });
      Object.assign(newImage, props);

      /** reset size */
      if (!isEqual(newImage.size, oldSize)) {
        const { width, height, aspectLock } = getDefaultOptions(props);
        Object.assign(newImage, { width, height, aspectLock });
      }
    }
  }

  /** set async changes */
  setAtom(imagesAtom, newImages);
};

/** reset options for image to default */
export const resetOptions = async (index: number) => {
  const newImages = cloneDeep(getAtom(imagesAtom));

  /** list of indices to set */
  const indices = index === -1 ? range(newImages.length) : [index];

  /** reset images */
  for (const index of indices) {
    const newImage = newImages[index];
    if (!newImage) continue;
    const props = await svgProps(newImage.source, newImage.filename);
    const options = getDefaultOptions(props);
    Object.assign(newImage, { ...props, ...options });
  }

  setAtom(imagesAtom, newImages);
};

/** remove image from list */
export const removeImage = (index: number) => {
  const newImages = cloneDeep(getAtom(imagesAtom));
  newImages.splice(index, 1);
  setAtom(imagesAtom, newImages);
};

/** clear image list */
export const clearImages = () => setAtom(imagesAtom, []);

/** get default options for an image */
export const getDefaultOptions = (props?: Props) => {
  const width = props?.size.width ?? 512;
  const height = props?.size.height ?? 512;

  return {
    width,
    height,
    aspectLock: width / height,
    trim: false,
    margin: 0,
    fit: "contain",
    background: "",
    color: "",
    darkPreview: false,
  };
};

export const sampleFile = {
  source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">\n  <circle fill="#e91e63" cx="0" cy="0" r="50" />\n</svg>`,
  filename: "sample.svg",
};

/** flag to edit all images together */
export const editAllAtom = atomWithStorage("edit-all", false);

/** save format */
export const formatAtom = atomWithStorage<"png" | "jpeg">("format", "png");
