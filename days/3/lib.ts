type ItemType = string;
type RucksackItemTypes = ItemType[];
type RucksackCompartements = [ItemType[], ItemType[]];

export function parser(input: string) {
  const allRucksackItemTypes = input
    .split(/\n/)
    .reduce((acc, rucksackItemTypesStr: string) => {
      if (rucksackItemTypesStr) {
        acc.push(rucksackItemTypesStr.split(""));
      }

      return acc;
    }, [] as RucksackItemTypes[]);

  return allRucksackItemTypes;
}

export function getRucksackCompartments(rucksackItemTypes: RucksackItemTypes) {
  const compartmentSize = rucksackItemTypes.length / 2;
  const rucksackCompartments: RucksackCompartements = [
    rucksackItemTypes.slice(0, compartmentSize),
    rucksackItemTypes.slice(compartmentSize),
  ];

  return rucksackCompartments;
}

export function getBothCompartmensItemType(
  allRucksackCompartements: RucksackCompartements[]
) {
  const bothCompartmentsItemType = allRucksackCompartements.map(
    ([firstCompartmentItemTypes, secondCompartmentItemTypes]) => {
      for (let i = 0, ii = secondCompartmentItemTypes.length; i < ii; i++) {
        if (firstCompartmentItemTypes.includes(secondCompartmentItemTypes[i])) {
          return secondCompartmentItemTypes[i];
        }
      }

      throw new Error("Item type must present in both compartments");
    }
  );

  return bothCompartmentsItemType;
}

const ELF_GROUP_SIZE = 3;
export function getElfGroupCommonItemType(
  allRucksackItemTypes: RucksackItemTypes[]
) {
  const elfGroupRucksackItemTypes: RucksackItemTypes[][] = [];

  if (!allRucksackItemTypes.length) {
    return elfGroupRucksackItemTypes;
  }

  for (
    let i = 0, ii = allRucksackItemTypes.length;
    i < ii;
    i += ELF_GROUP_SIZE
  ) {
    elfGroupRucksackItemTypes.push(
      allRucksackItemTypes.slice(i, i + ELF_GROUP_SIZE)
    );
  }

  return elfGroupRucksackItemTypes;
}

export function getCommonItemTypeInRucksacks(rucksacks: RucksackItemTypes[]) {
  const rucksacksItemCounts = rucksacks.map((rucksack) => rucksack.length);
  const maxRucksackItemCount = Math.max(...rucksacksItemCounts);
  const biggestRucksack = rucksacks.splice(
    rucksacksItemCounts.indexOf(maxRucksackItemCount),
    1
  )[0];

  for (let i = 0; i < maxRucksackItemCount; i++) {
    if (rucksacks.every((rucksack) => rucksack.includes(biggestRucksack[i]))) {
      return biggestRucksack[i];
    }
  }

  throw new Error("Can't find common item type in all rucksacks");
}

const IS_LOWER_CASE_REGEXP = /[a-z]/;
function isLowerCase(itemType: ItemType) {
  return IS_LOWER_CASE_REGEXP.test(itemType);
}

// In unicode 'A' equals 65 and 'a' equals 97
const UNICODE_LC_A_CODE = 97;
const UNICODE_UC_A_CODE = 65;
export function getItemTypePriority(itemType: ItemType) {
  const charCode = itemType.charCodeAt(0);

  if (isLowerCase(itemType)) {
    return charCode - UNICODE_LC_A_CODE + 1;
  }

  return charCode - UNICODE_UC_A_CODE + 27;
}
