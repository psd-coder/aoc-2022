import { day, part } from "/lib/define.ts";

import { getRope, parser, runSimulation } from "./lib.ts";

export default day({
  part1: part({
    parser,
    solver: (movements) => {
      const tailVisitedPositions = runSimulation(getRope(2), movements);

      return tailVisitedPositions;
    },
  }),
  part2: part({
    parser,
    solver: (movements) => {
      const tailVisitedPositions = runSimulation(getRope(10), movements);

      return tailVisitedPositions;
    },
  }),
});
