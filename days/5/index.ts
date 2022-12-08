import { day, part } from "/lib/define.ts";

import {
  applyCommands,
  getMovedItemsByGroup,
  getMovedItemsByOne,
  getTopStackSupplies,
  parser,
} from "./lib.ts";

export default day({
  part1: part({
    parser,
    solver: ({ stacks, commands }) => {
      const processedStacks = applyCommands(
        stacks,
        commands,
        getMovedItemsByOne,
      );
      const topStackSupplies = getTopStackSupplies(processedStacks);

      return topStackSupplies.join("");
    },
  }),
  part2: part({
    parser,
    solver: ({ stacks, commands }) => {
      const processedStacks = applyCommands(
        stacks,
        commands,
        getMovedItemsByGroup,
      );
      const topStackSupplies = getTopStackSupplies(processedStacks);

      return topStackSupplies.join("");
    },
  }),
});
