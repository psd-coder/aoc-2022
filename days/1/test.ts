import { describe, it } from "https://deno.land/std@0.167.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

import { readData } from "/lib/utils.ts";

import { mostCalloriesElf, parser, sumElvesCallories } from "./lib.ts";

describe("Day 1", () => {
  const data = readData("./input.test.txt", import.meta);
  const parsedData = parser(data);
  const elvesCalories = sumElvesCallories(parsedData);

  it("Parses data", () => {
    assertEquals(parser(data), [[
      1000,
      2000,
      3000,
    ], [
      4000,
    ], [
      5000,
      6000,
    ], [
      7000,
      8000,
      9000,
    ], [
      10000,
    ]]);
  });

  it("Calculates calories per elves", () => {
    assertEquals(elvesCalories, [
      6000,
      4000,
      11000,
      24000,
      10000,
    ]);
  });

  it("Find the Elf carrying the most Calories", () => {
    assertEquals(mostCalloriesElf(elvesCalories), 24000);
  });
});
