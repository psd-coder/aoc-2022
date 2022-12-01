import { readFile } from "fs/promises";
import path from "path";

export const parseInput = async () => {
  const input = await readFile(path.resolve(__dirname, "./input.txt"), "utf-8");

  const snackCaloriesByElves: string[][] = input
    .split(/\n\n/)
    .map((elfSnacksStr: string) => elfSnacksStr.split(/\n/));
  const caloriesPerElf = snackCaloriesByElves.map((values) =>
    values.reduce((acc, v) => acc + parseInt(v || "0", 10), 0)
  );

  return caloriesPerElf;
};
