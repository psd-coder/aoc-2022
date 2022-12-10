import { day, part } from "/lib/define.ts";

import {
  calculateSignalStrength,
  collectCycleValues,
  drawImage,
  parser,
  renderImage,
} from "./lib.ts";
import { arraySum } from "../../lib/utils.ts";

export default day({
  part1: part({
    parser,
    solver: (operations) => {
      const cycleValues = collectCycleValues(operations);
      const cycleStrength = calculateSignalStrength(cycleValues, [
        20,
        60,
        100,
        140,
        180,
        220,
      ]);

      return arraySum(cycleStrength);
    },
  }),
  part2: part({
    parser,
    solver: (operations) => {
      const cycleValues = collectCycleValues(operations);
      const image = drawImage(cycleValues);

      return renderImage(image);
    },
  }),
});
