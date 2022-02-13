// config file banner
export type Styles = {
  "class-name": string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
