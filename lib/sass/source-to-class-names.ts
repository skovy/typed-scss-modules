import Core from "css-modules-loader-core";

const core = new Core();

export const sourceToClassNames = (source: Loadable) => {
  return core.load(source);
};
