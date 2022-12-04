import { day, part } from "@lib/define";
import { countPositives } from "@lib/utils";

import { parser, isFullyOverlap, isIntersect } from "./lib";

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
