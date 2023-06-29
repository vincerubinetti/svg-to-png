import { getDefaultStore } from "jotai";

/** singleton store instance to access state outside of react */
export const store = getDefaultStore();
