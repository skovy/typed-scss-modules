const canResolvePrettier = jest.fn(() => false);
import { jest } from "@jest/globals";
jest.mock("../../lib/prettier/can-resolve.js", () => canResolvePrettier);
export default canResolvePrettier;
