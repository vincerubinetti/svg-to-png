import { Atom, getDefaultStore } from "jotai";

/** singleton store instance to access state outside of react */
export const store = getDefaultStore();

/** wait for store value to change */
export const storeChange = (atom: Atom<unknown>): Promise<void> =>
  new Promise((resolve) => {
    const unsub = store.sub(atom, () => {
      resolve();
      unsub();
    });
  });
