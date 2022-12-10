import { arraySum } from "/lib/helpers.ts";

type ElfCalories = number;
type DayInput = ElfCalories[][];

export function parser(input: string): DayInput {
  const snackCaloriesByElves: ElfCalories[][] = input
    .split(/\n\n/)
    .map((elfSnacksStr: string) =>
      elfSnacksStr.split(/\n/).map((v) => parseInt(v || "0", 10))
    );

  return snackCaloriesByElves;
}

export function sumElvesCallories(
  snackCaloriesByElves: DayInput,
): ElfCalories[] {
  return snackCaloriesByElves.map((values) => arraySum(values));
}

export function mostCalloriesElf(elvesCalories: ElfCalories[]) {
  return Math.max(...elvesCalories);
}
