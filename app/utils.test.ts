import { splitItemIntoNameAndQty } from "./utils";

test("SplitItemIntoNameAndQty properly splits name and qty by tabs", () => {
  expect(splitItemIntoNameAndQty("Fullerite-C72\t16778\nFullerite-C50\t19612"))
    .toBe([["Fullerite-C72", "16778"], ["Fullerite-C50", "19612"]])
});
