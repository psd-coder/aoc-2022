import { day, part } from "@lib/define";

import { parser, countVisibleTrees, calculateBestScenicScore } from "./lib";

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
