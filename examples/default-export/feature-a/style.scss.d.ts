export type Styles = {
  i: string;
  "i-am-kebab-cased": string;
  while: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
