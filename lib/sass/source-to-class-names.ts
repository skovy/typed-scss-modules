import Core, { Source } from "css-modules-loader-core";

const core = new Core();

export const sourceToClassNames = async (source: Source) => {
  return core.load(source, undefined, undefined, noOpPathFetcher);
};

const noOpPathFetcher = () => Promise.resolve({});
