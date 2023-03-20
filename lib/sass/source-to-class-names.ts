import csstree from "css-tree";

export const sourceToClassNames = (source: string) => {
  const ast = csstree.parse(source, {
    parseAtrulePrelude: false,
    parseValue: false,
  });
  const classNames: string[] = [];

  csstree.walk(ast, (node) => {
    if (node.type === 'Selector') {
      node.children.forEach((item) => {
        if (item.type === 'ClassSelector') {
          classNames.push(item.name);
        }
      });
    }
  });

  return classNames;
};
