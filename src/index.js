import { create, generateStruct } from "./actions.js";
export const init = (flags, input) => {
  if (flags.create) {
    create(input, flags.lang);
  }
  if (flags.generate) {
    generateStruct(input);
  }
};
