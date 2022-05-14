import Core, { Source } from "@demching113/css-modules-loader-core";

const core = new Core();

export const sourceToClassNames = (source: Source) => {
  return core.load(source, undefined, undefined, noOpPathFetcher);
};

const noOpPathFetcher = () => Promise.resolve({});
