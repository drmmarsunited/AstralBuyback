import { parsePropsAndCreateItemNameList, splitItemIntoNameAndQty } from "./utils";

// splitItemIntoNameAndQty tests //

test("properly splits name and qty by tabs with eve item names and quantities", () => {
  expect(splitItemIntoNameAndQty("Fullerite-C72\t16778\nFullerite-C50\t19612"))
    .toStrictEqual([["Fullerite-C72", "16778"], ["Fullerite-C50", "19612"]])
});

test("properly splits name and qty by tabs with random names and quantities", () => {
  expect(splitItemIntoNameAndQty("eggs\t16778\nbeans\t19612"))
    .toStrictEqual([["eggs", "16778"], ["beans", "19612"]])
});

test("properly splits name and qty by tabs with random names and no quantities", () => {
  expect(splitItemIntoNameAndQty("eggs\nbeans"))
    .toStrictEqual([])
});

test("properly splits name and qty by tabs with mix of random names and quantities", () => {
  expect(splitItemIntoNameAndQty("eggs\nbeans\t88\ntoast\t999\nFullerite-C72\t16778"))
    .toStrictEqual([["beans", "88"], ["toast", "999"], ["Fullerite-C72", "16778"]])
});

// parsePropsAndCreateItemNameList tests //

test("properly retrieve valid Eve item names and quantities from provided array of arrays", () => {
  expect(parsePropsAndCreateItemNameList([["Fullerite-C72", "16778"], ["Fullerite-C50", "19612"]]))
    .toStrictEqual(["Fullerite-C72", "Fullerite-C50"])
});

test("properly retrieve valid Eve item names from provided array of arrays with missing quantities", () => {
  expect(parsePropsAndCreateItemNameList([["Fullerite-C72"], ["Fullerite-C50"]]))
    .toStrictEqual([])
});

test("properly retrieve random names and quantities from provided array of arrays", () => {
  expect(parsePropsAndCreateItemNameList([["eggs", "16778"], ["beans", "19612"]]))
    .toStrictEqual(["eggs", "beans"])
});

test("properly retrieve random names from provided array of arrays with some missing quantites", () => {
  expect(parsePropsAndCreateItemNameList([["eggs"], ["beans", "19612"]]))
    .toStrictEqual(["beans"])
});
