import { day, part } from "/lib/define.ts";
import { arraySum } from "/lib/utils.ts";
import { parser, sumCalloriesPerElf } from "./lib.ts";

export default day({
  part1: part({
    parser,
    solver: (snackCaloriesByElves) => {
      return Math.max(...sumCalloriesPerElf(snackCaloriesByElves));
    },
  }),
  part2: part({
    parser,
    solver: (snackCaloriesByElves) => {
      const caloriesPerElf = sumCalloriesPerElf(snackCaloriesByElves);
      const sortedCaloriesPerElves = caloriesPerElf.sort((a, b) => b - a);
      const threeMostCaloriedElves = sortedCaloriesPerElves.slice(0, 3);

      return arraySum(threeMostCaloriedElves);
    },
  }),
});
