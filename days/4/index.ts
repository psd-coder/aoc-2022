import { day, part } from "/lib/define.ts";
import { countPositives } from "/lib/utils.ts";

import { isFullyOverlap, isIntersect, parser } from "./lib.ts";

export default day({
  part1: part({
    parser,
    solver: (pairsRanges) => {
      const overlappedPairsRanges = pairsRanges.map(isFullyOverlap);

      return countPositives(overlappedPairsRanges);
    },
  }),
  part2: part({
    parser,
    solver: (pairsRanges) => {
      const intersectedPairsRanges = pairsRanges.map(isIntersect);

      return countPositives(intersectedPairsRanges);
    },
  }),
});
