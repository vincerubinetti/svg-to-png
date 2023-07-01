import { atom, getDefaultStore } from "jotai";
import { cloneDeep, range } from "lodash";
import { svgProps } from "./../util/svg";

/** singleton store instance to access state outside of react */
const store = getDefaultStore();

/** input file */
type File = { source: string; filename: string };

/** computed/derived props from input file */
type Props = Awaited<ReturnType<typeof svgProps>>;

/** options to determine output */
type Options = ReturnType<typeof getDefaultOptions>;

/** full image object */
export type Image = File & Props & Options;

/** list of images */
export const images = atom<Image[]>([]);

/** add images to list */
export const addImages = async (newFiles: File[]) => {
  /** clear images first if still on just starting sample file */
  if (justSample) {
    justSample = false;
    clearImages();
  }

  /** expand provided new files into full images */
  const newImages: Image[] = await Promise.all(
    newFiles.map(async (file) => {
      const props = await svgProps(file.source, file.filename);
      const options = getDefaultOptions(props);
      return { ...file, ...props, ...options };
    })
  );

  store.set(images, (prevImages) => prevImages.concat(newImages));
};

/** set arbitrary field on image */
export const setImage = async <Key extends keyof Image>(
  index: number,
  key: Key,
  value: Image[Key]
) => {
  let newImages = cloneDeep(store.get(images));

  /** list of indices to set */
  const indices = index === -1 ? range(newImages.length) : [index];

  /** set as much as possible synchronously first
   * https://stackoverflow.com/questions/46000544/react-controlled-input-cursor-jumps#comment126597443_48608293 */
  for (const index of indices) {
    /** update value */
    newImages[index][key] = value;

    /** lock aspect ratio */
    if (key === "aspect" && value === Infinity)
      newImages[index].aspect =
        newImages[index].width / newImages[index].height;

    /** preserve aspect ratio */
    if (key === "width" && newImages[index].aspect)
      newImages[index].height =
        newImages[index].width / newImages[index].aspect;
    if (key === "height" && newImages[index].aspect)
      newImages[index].width =
        newImages[index].height * newImages[index].aspect;
  }

  /** set sync changes */
  store.set(images, newImages);

  /** re-fresh new images */
  newImages = cloneDeep(store.get(images));

  /** then do async changes */
  for (const index of indices) {
    /** when input file changes */
    if (["source", "filename"].includes(key)) {
      /** update computed props */
      const props = await svgProps(
        newImages[index].source,
        newImages[index].filename
      );
      Object.assign(newImages[index], props);
    }
  }

  /** set async changes */
  store.set(images, newImages);
};

/** reset options for a image to default */
export const resetOptions = (index: number) => {
  const newImages = cloneDeep(store.get(images));

  /** list of indices to set */
  const indices = index === -1 ? range(newImages.length) : [index];

  /** reset images */
  for (const index of indices)
    Object.assign(newImages[index], getDefaultOptions(newImages[index]));

  store.set(images, newImages);
};

/** remove image from list */
export const removeImage = (index: number) =>
  store.set(images, (prevImages) =>
    prevImages.slice(0, index).concat(prevImages.slice(index + 1))
  );

/** clear image list */
export const clearImages = () => store.set(images, []);

/** get default options for an image */
export const getDefaultOptions = (props: Props) => {
  const width = props.inferred.width;
  const height = props.inferred.height;

  return {
    width,
    height,
    aspect: width / height,
    margin: 0,
    fit: "contain",
    background: "",
    darkCheckers: false,
  };
};

const sampleFile = {
  source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">\n  <circle fill="#e91e63" cx="0" cy="0" r="100" />\n</svg>`,
  filename: "sample.svg",
};

let justSample = true;
addImages([sampleFile]);
justSample = true;

/** flag to edit all images together */
export const all = atom(false);
