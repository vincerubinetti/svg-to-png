import { getDefaultStore } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { cloneDeep, range } from "lodash";
import { svgProps } from "@/util/svg";

/** singleton store instance to access state outside of react */
const store = getDefaultStore();

/** input file */
type File = { source: string; name: string };

/** computed/derived props from input file */
type Props = Awaited<ReturnType<typeof svgProps>>;

/** options for output */
type Options = ReturnType<typeof getDefaultOptions>;

/** full image object */
export type Image = File & Props & Options;

/** list of images */
export const images = atomWithStorage<Image[]>("images", []);

/** add images to list */
export const addImages = async (newFiles: File[]) => {
  const newImages = cloneDeep(store.get(images));

  /** remove first sample file */
  if (newImages[0]?.source === sampleFile.source) newImages.splice(0, 1);

  /** expand provided new files into full images */
  const results: Image[] = await Promise.all(
    newFiles.map(async (file) => {
      const props = await svgProps(file.source);
      const options = getDefaultOptions(props);
      return { ...file, ...props, ...options };
    }),
  );

  /** append to end */
  newImages.push(...results);

  store.set(images, newImages);
};

/** set arbitrary field on image */
export const setImage = async <Key extends keyof Image>(
  index: number,
  key: Key,
  value: Image[Key],
) => {
  let newImages = cloneDeep(store.get(images));

  /** list of indices to set. set all if -1. */
  const indices = index === -1 ? range(newImages.length) : [index];

  /**
   * set as much as possible synchronously first
   * https://stackoverflow.com/questions/46000544/react-controlled-input-cursor-jumps#comment126597443_48608293
   */
  for (const index of indices) {
    /** update value */
    newImages[index][key] = value;

    /** lock aspect ratio */
    if (key === "aspectLock" && value === Infinity)
      newImages[index].aspectLock =
        newImages[index].width / newImages[index].height;

    /** preserve aspect ratio */
    if (key === "width" && newImages[index].aspectLock)
      newImages[index].height =
        newImages[index].width / newImages[index].aspectLock;
    if (key === "height" && newImages[index].aspectLock)
      newImages[index].width =
        newImages[index].height * newImages[index].aspectLock;
  }

  /** set sync changes */
  store.set(images, newImages);

  /** re-clone so second store set works */
  newImages = cloneDeep(newImages);

  /** when input file changes */
  if (["source", "trim"].includes(key)) {
    for (const index of indices) {
      /** update computed props */
      const props = await svgProps(newImages[index].source, {
        trim: newImages[index].trim,
      });
      /** reset size */
      const { width, height, aspectLock } = getDefaultOptions(props);
      Object.assign(newImages[index], { ...props, width, height, aspectLock });
    }
  }

  /** set async changes */
  store.set(images, newImages);
};

/** reset options for image to default */
export const resetOptions = async (index: number) => {
  const newImages = cloneDeep(store.get(images));

  /** list of indices to set */
  const indices = index === -1 ? range(newImages.length) : [index];

  /** reset images */
  for (const index of indices) {
    const props = await svgProps(newImages[index].source);
    const options = getDefaultOptions(props);
    Object.assign(newImages[index], { ...props, ...options });
  }

  store.set(images, newImages);
};

/** remove image from list */
export const removeImage = (index: number) => {
  const newImages = cloneDeep(store.get(images));
  newImages.splice(index, 1);
  store.set(images, newImages);
};

/** clear image list */
export const clearImages = () => store.set(images, []);

/** get default options for an image */
export const getDefaultOptions = (props: Props) => {
  const width = props.size.width;
  const height = props.size.height;

  return {
    width,
    height,
    aspectLock: width / height,
    trim: false,
    margin: 0,
    fit: "contain",
    background: "",
    color: "",
    darkCheckers: false,
  };
};

const sampleFile = {
  source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">\n  <circle fill="#e91e63" cx="0" cy="0" r="100" />\n</svg>`,
  name: "sample.svg",
};

/** add sample file on page load, if no files there */
images.onMount = () => {
  if (!store.get(images).length) addImages([sampleFile]);
};

/** flag to edit all images together */
export const editAll = atomWithStorage("edit-all", false);
