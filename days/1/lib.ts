import { arraySum } from "/lib/utils.ts";

type DayInput = string[][];

export function parser(input: string): DayInput {
  const snackCaloriesByElves: string[][] = input
    .split(/\n\n/)
    .map((elfSnacksStr: string) => elfSnacksStr.split(/\n/));

  return snackCaloriesByElves;
}

export function sumCalloriesPerElf(snackCaloriesByElves: DayInput) {
  return snackCaloriesByElves.map((values) =>
    arraySum(values, (v) => parseInt(v || "0", 10))
  );
}
