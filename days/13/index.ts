import { day, part } from "/lib/define.ts";
import { getSumOfCorrectlyOrderedPairsIndexes, getDividerIndexesResultForOrderedPairs, parser } from "./lib.ts";

export default day({
  part1: part({
    parser,
    solver: (packetPairs) => {
      return getSumOfCorrectlyOrderedPairsIndexes(packetPairs);
    },
  }),
  part2: part({
    parser,
    solver: (packetPairs) => {
      return getDividerIndexesResultForOrderedPairs(packetPairs);
    },
  }),
});
