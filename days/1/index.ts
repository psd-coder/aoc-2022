import { day, part } from "/lib/define.ts";
import { arraySum } from "/lib/helpers.ts";
import { mostCalloriesElf, parser, sumElvesCallories } from "./lib.ts";

export default day({
  part1: part({
    parser,
    solver: (snackCaloriesByElves) => {
      const caloriesPerElfs = sumElvesCallories(snackCaloriesByElves);

      return mostCalloriesElf(caloriesPerElfs);
    },
  }),
  part2: part({
    parser,
    solver: (snackCaloriesByElves) => {
      const caloriesPerElf = sumElvesCallories(snackCaloriesByElves);
      const sortedCaloriesPerElves = caloriesPerElf.sort((a, b) => b - a);
      const threeMostCaloriedElves = sortedCaloriesPerElves.slice(0, 3);

      return arraySum(threeMostCaloriedElves);
    },
  }),
});
