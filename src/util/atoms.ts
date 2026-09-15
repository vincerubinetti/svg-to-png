import type { Atom, PrimitiveAtom } from "jotai";
import { getDefaultStore } from "jotai";

/** get atom util func */
export const getAtom = <Value>(atom: Atom<Value>) =>
  getDefaultStore().get(atom);

/** set atom util func */
export const setAtom = <Value>(
  atom: PrimitiveAtom<Value>,
  update: Value | ((value: Value) => Value),
) => {
  getDefaultStore().set(atom, update);
  return getAtom(atom);
};
