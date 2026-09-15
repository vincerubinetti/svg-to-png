import type { Atom, PrimitiveAtom } from "jotai";
import { getDefaultStore } from "jotai";

export const getAtom = <Value>(atom: Atom<Value>) =>
  getDefaultStore().get(atom);

export const setAtom = <Value>(
  atom: PrimitiveAtom<Value>,
  update: Value | ((value: Value) => Value),
) => {
  getDefaultStore().set(atom, update);
  return getAtom(atom);
};
