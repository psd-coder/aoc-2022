import { day, part } from "/lib/define.ts";
import { buildMap, parser, simulate } from "./lib.ts";

export default day({
  part1: part({
    parser,
    solver: (input) => {
      const initialMap = buildMap(input, false);
      const { restSandCounter } = simulate(initialMap);

      return restSandCounter;
    },
  }),
  part2: part({
    parser,
    solver: (input) => {
      const initialMap = buildMap(input, true);
      const { restSandCounter } = simulate(initialMap);

      return restSandCounter;
    },
  }),
});
