import { day, part } from "/lib/define.ts";
import { arraySum, assertNonNullable } from "/lib/helpers.ts";

import { getDirSizesMap as getDirSizesMap, parser } from "./lib.ts";

export default day({
  part1: part({
    parser,
    solver: (tree) => {
      const SIZE_LIMIT = 100000;
      const dirSizesMap = getDirSizesMap(tree);
      const dirSizes = Array.from(dirSizesMap.values());
      const dirSizeBelowLimit = dirSizes.filter((size) => size < SIZE_LIMIT);

      return arraySum(dirSizeBelowLimit);
    },
  }),
  part2: part({
    parser,
    solver: (tree) => {
      const TOTAL_DISK_SIZE = 70000000;
      const TARGET_FREE_SIZE = 30000000;
      const dirSizesMap = getDirSizesMap(tree);
      const treeSize = dirSizesMap.get(tree)!;
      const unusedSize = TOTAL_DISK_SIZE - treeSize;
      const remainsToFree = TARGET_FREE_SIZE - unusedSize;

      const dirSizes = Array.from(dirSizesMap.values());
      const matchedDirSizes = dirSizes.filter((size) => size >= remainsToFree);
      const ascSortedDirSizes = matchedDirSizes.sort((a, b) => a - b);
      const minAppropriableDirSize = ascSortedDirSizes.at(0);

      assertNonNullable(
        minAppropriableDirSize,
        "There no any appropriable directories to remove",
      );

      return minAppropriableDirSize;
    },
  }),
});
