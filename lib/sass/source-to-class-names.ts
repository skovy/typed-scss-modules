import Core, { Source } from "css-modules-loader-core";

const core = new Core();

export const sourceToClassNames = (source: Source) => {
  return core.load(source);
};
