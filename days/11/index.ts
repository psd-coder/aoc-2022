import { day, part } from "/lib/define.ts";
import {
  decreaseWorryLevelByTreeTimes,
  getMonkeyBusinessLevel,
  keepWorryLevel,
  parser,
  runNRounds,
} from "./lib.ts";

export default day({
  part1: part({
    parser,
    solver: (monkeys) => {
      const result = runNRounds(monkeys, 20, decreaseWorryLevelByTreeTimes);
      const monkeyBusiness = getMonkeyBusinessLevel(result.inspections, 2);

      return monkeyBusiness;
    },
  }),
  part2: part({
    parser,
    solver: (monkeys) => {
      const result = runNRounds(monkeys, 10000, keepWorryLevel);
      const monkeyBusiness = getMonkeyBusinessLevel(result.inspections, 2);

      return monkeyBusiness;
    },
  }),
});
