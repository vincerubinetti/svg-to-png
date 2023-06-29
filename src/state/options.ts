import { atomWithImmer } from "jotai-immer";
import { range } from "lodash";
import { store } from "@/state";
import { computed, defaultHeight, defaultWidth } from "@/state/computed";

type Option = {
  width: number;
  height: number;
  aspect: number;
  margin: number;
  fit: "contain" | "cover" | "stretch";
  background: string;
};

/** list of options for rendering */
export const options = atomWithImmer<Option[]>([]);

/** add/remove options when files change */
store.sub(computed, () =>
  store.set(options, (newOptions) => {
    const getOptions = newOptions?.length || 0;
    const getComputed = store.get(computed)?.length || 0;

    /** fill in any new files added with defaults */
    for (let index = getOptions; index < getComputed; index++)
      newOptions.push(getDefaultOption(index));

    /** remove options for deleted files */
    newOptions.splice(getComputed);
  })
);

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

/** reset option to default */
export const resetOption = (index: number) =>
  store.set(options, (newOptions) => {
    /** list items to set */
    const indices = index === -1 ? range(store.get(options).length) : [index];

    /** reset list items */
    for (const index of indices) newOptions[index] = getDefaultOption(index);
  });

/** get default options for list item */
const getDefaultOption = (index: number): Option => {
  const getComputed = store.get(computed);

  const width = getComputed?.[index]?.dimensions.width || defaultWidth;
  const height = getComputed?.[index]?.dimensions.height || defaultHeight;

  return {
    width,
    height,
    aspect: width / height,
    margin: 0,
    fit: "contain",
    background: "",
  };
};
