import {
  Implementations,
  IMPLEMENTATIONS,
} from "../../lib/implementations/index.js";

export const describeAllImplementations = (
  fn: (implementation: Implementations) => void
) => {
  IMPLEMENTATIONS.forEach((implementation: Implementations) => {
    describe(`${implementation} implementation`, () => fn(implementation));
  });
};
