import { day, part } from "/lib/define.ts";
import { arraySum } from "/lib/utils.ts";

import {
  getBothCompartmensItemType,
  getCommonItemTypeInRucksacks,
  getElfGroupCommonItemType,
  getItemTypePriority,
  getRucksackCompartments,
  parser,
} from "./lib.ts";

export default day({
  part1: part({
    parser,
    solver: (allRucksackItemTypes) => {
      const allRucksackCompartments = allRucksackItemTypes.map(
        getRucksackCompartments,
      );
      const bothCompartmentsItemType = getBothCompartmensItemType(
        allRucksackCompartments,
      );
      const rucksackPriorities = bothCompartmentsItemType.map(
        getItemTypePriority,
      );

      return arraySum(rucksackPriorities);
    },
  }),
  part2: part({
    parser,
    solver: (allRucksackItemTypes) => {
      const elfGroupCommonItemType = getElfGroupCommonItemType(
        allRucksackItemTypes,
      );
      const commonItemTypes = elfGroupCommonItemType.map(
        getCommonItemTypeInRucksacks,
      );
      const commonItemTypesPriorities = commonItemTypes.map(
        getItemTypePriority,
      );

      return arraySum(commonItemTypesPriorities);
    },
  }),
});
