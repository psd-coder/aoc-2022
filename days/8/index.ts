import { day, part } from "/lib/define.ts";

import { calculateBestScenicScore, countVisibleTrees, parser } from "./lib.ts";

export default day({
  part1: part({
    parser,
    solver: (treesMap) => {
      return countVisibleTrees(treesMap);
    },
  }),
  part2: part({
    parser,
    solver: (treesMap) => {
      return calculateBestScenicScore(treesMap);
    },
  }),
});
