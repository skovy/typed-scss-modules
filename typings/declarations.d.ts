declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
  const Styles: { [className: string]: string };
  export type Styles = typeof Styles;
  const ClassNames: keyof Styles;
  export type ClassNames = typeof ClassNames;
}
