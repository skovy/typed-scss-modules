export type Styles = {
  i: string;
  "i-am-kebab-cased": string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
