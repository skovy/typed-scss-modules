interface ToStringable {
  toString(encoding?: string, start?: number, end?: number): string;
}

type Loadable = string | ToStringable;

interface LoadResult {
  injectableSource: string;
  exportTokens: { [index: string]: string };
}

declare class Core {
  constructor();

  /**
   * @param source the input CSS source string to process
   */
  public load(source: Loadable): Promise<LoadResult>;
}

declare module "css-modules-loader-core" {
  export = Core;
}
