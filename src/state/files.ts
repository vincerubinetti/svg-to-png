import { atomWithImmer } from "jotai-immer";
import { store } from "@/state";

type File = {
  name: string;
  source: string;
};

export const sampleFile: File = {
  name: "sample.svg",
  source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">\n  <circle fill="#e91e63" cx="0" cy="0" r="100" />\n</svg>`,
};

/** list of inputted svg files */
export const files = atomWithImmer([sampleFile]);

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
export const addFiles = (toAdd: File[]) =>
  store.set(files, (newFiles) => newFiles.concat(toAdd));

/** remove file from file list */
export const removeFile = (index: number) =>
  store.set(files, (newFiles) => {
    newFiles.splice(index, 1);
  });

/** reset file list to just sample file */
export const clearFiles = () => store.set(files, []);
