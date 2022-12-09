import { day, part } from "/lib/define.ts";

import { parser, runMovements } from "./lib.ts";

export default day({
  part1: part({
    parser,
    solver: (movements) => {
      const uniquePositions = runMovements(movements);

      return uniquePositions;
    },
  }),
});
