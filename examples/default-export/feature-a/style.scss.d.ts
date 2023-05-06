export type Styles = {
  i: "color: orange;";
  "i-am-kebab": `color: green;
    background-color: red;`;
  "i-am-kebab-cased": "color: red;";
  while: "color: blue;";
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
