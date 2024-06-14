import { expect, test } from "vitest";
import { foo } from "./foo";

test("should add two numbers from the given params", () => {
  expect(foo(1, 2)).toStrictEqual(3);
});
