import styles, { ClassNames, Styles } from "./style.scss";

console.log(styles.i);
console.log(styles["i-am-kebab-cased"]);

// Using the ClassNames union type to assign class names.
const className: ClassNames = "i-am-kebab-cased";

// Using the Styles type for reconstructing a subset.
export const classNames: Partial<Styles> = {
  [className]: "something",
  i: "a-string",
};
