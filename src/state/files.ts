import { atomWithImmer } from "jotai-immer";
import { isEqual } from "lodash";
import { store, storeChange } from "@/state";
import { computed } from "@/state/computed";
import { getDefaultOption, options } from "@/state/options";

type File = {
  name: string;
  source: string;
};

/** list of inputted svg files */
export const files = atomWithImmer<File[]>([]);

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

/** add files to file list */
export const addFiles = async (toAdd: File[]) => {
  /** clear if just sample file */
  if (isEqual(store.get(files), [sampleFile])) clearFiles();

  /** add files */
  store.set(files, (newFiles) => newFiles.concat(toAdd));

  /** wait for computed to update from added files */
  await storeChange(computed);

  /** add new corresponding options */
  store.set(options, (newOptions) =>
    newOptions.concat(
      toAdd.map((_, index) => getDefaultOption(newOptions.length + index))
    )
  );
};

/** remove file from file list */
export const removeFile = (index: number) => {
  store.set(files, (newFiles) => {
    newFiles.splice(index, 1);
  });

  /** remove corresponding option */
  store.set(options, (newOptions) => {
    newOptions.splice(index, 1);
  });
};

/** clear file list */
export const clearFiles = () => {
  store.set(files, []);

  /** clear options */
  store.set(options, []);
};

const sampleFile: File = {
  name: "sample.svg",
  source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">\n  <circle fill="#e91e63" cx="0" cy="0" r="100" />\n</svg>`,
};

window.setTimeout(() => addFiles([sampleFile]), 0);
