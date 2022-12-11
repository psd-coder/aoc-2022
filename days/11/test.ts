import { describe, it } from "https://deno.land/std@0.167.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

import { readData } from "/lib/utils.ts";

import {
  decreaseWorryLevelByTreeTimes,
  getInspectionWorryLevel,
  getMonkeyBusinessLevel,
  getNewMonkeyIndex,
  Items,
  keepWorryLevel,
  parser,
  runNRounds,
  WorryLevel,
} from "./lib.ts";

describe("Day 11", () => {
  const data = readData("./input.test.txt", import.meta);
  const parsedData = parser(data);

  it("Parses data", () => {
    assertEquals(parsedData, [
      {
        items: [79, 98],
        operation: {
          left: "old",
          operator: "*",
          right: 19,
        },
        test: {
          divider: 23,
          ifTrue: 2,
          ifFalse: 3,
        },
      },
      {
        items: [54, 65, 75, 74],
        operation: {
          left: "old",
          operator: "+",
          right: 6,
        },
        test: {
          divider: 19,
          ifTrue: 2,
          ifFalse: 0,
        },
      },
      {
        items: [79, 60, 97],
        operation: {
          left: "old",
          operator: "*",
          right: "old",
        },
        test: {
          divider: 13,
          ifTrue: 1,
          ifFalse: 3,
        },
      },
      {
        items: [74],
        operation: {
          left: "old",
          operator: "+",
          right: 3,
        },
        test: {
          divider: 17,
          ifTrue: 0,
          ifFalse: 1,
        },
      },
    ]);
  });

  it("Should descrease worry level by three times", () => {
    assertEquals(decreaseWorryLevelByTreeTimes(1501), 500);
    assertEquals(decreaseWorryLevelByTreeTimes(1862), 620);
    assertEquals(decreaseWorryLevelByTreeTimes(60), 20);
  });

  it("Gets correct worry level after item inspection", () => {
    assertEquals(getInspectionWorryLevel(79, parsedData[0].operation), 1501);
    assertEquals(getInspectionWorryLevel(54, parsedData[1].operation), 60);
    assertEquals(getInspectionWorryLevel(79, parsedData[2].operation), 6241);
  });

  it("Gets correct monkey index when tests worry level", () => {
    assertEquals(getNewMonkeyIndex(500, parsedData[0].test), 3);
    assertEquals(getNewMonkeyIndex(620, parsedData[0].test), 3);
    assertEquals(getNewMonkeyIndex(2080, parsedData[2].test), 1);
  });

  it("Gets monkey business level", () => {
    const inspections = new Map([[0, 101], [1, 95], [2, 7], [3, 105]]);

    assertEquals(getMonkeyBusinessLevel(inspections, 2), 10605);
  });

  const assertCorrectWorryLevelAtNRound = (
    n: number,
    getReliefWorryLevel: (worryLevel: WorryLevel) => WorryLevel,
    compareWith: { items?: Items[]; inspections?: number[] },
  ) => {
    const result = runNRounds(parsedData, n, getReliefWorryLevel);

    if (compareWith.items) {
      assertEquals(result.monkeys.map(({ items }) => items), compareWith.items);
    }

    if (compareWith.inspections) {
      assertEquals(
        result.inspections,
        new Map(compareWith.inspections.map((v, i) => [i, v])),
      );
    }
  };

  it("Calculates correct items worry level after 20 rounds with decreasing worry level", () => {
    assertCorrectWorryLevelAtNRound(1, decreaseWorryLevelByTreeTimes, {
      items: [
        [20, 23, 27, 26],
        [2080, 25, 167, 207, 401, 1046],
        [],
        [],
      ],
    });
    assertCorrectWorryLevelAtNRound(2, decreaseWorryLevelByTreeTimes, {
      items: [
        [695, 10, 71, 135, 350],
        [43, 49, 58, 55, 362],
        [],
        [],
      ],
    });
    assertCorrectWorryLevelAtNRound(3, decreaseWorryLevelByTreeTimes, {
      items: [
        [16, 18, 21, 20, 122],
        [1468, 22, 150, 286, 739],
        [],
        [],
      ],
    });
    assertCorrectWorryLevelAtNRound(4, decreaseWorryLevelByTreeTimes, {
      items: [
        [491, 9, 52, 97, 248, 34],
        [39, 45, 43, 258],
        [],
        [],
      ],
    });
    assertCorrectWorryLevelAtNRound(5, decreaseWorryLevelByTreeTimes, {
      items: [
        [15, 17, 16, 88, 1037],
        [20, 110, 205, 524, 72],
        [],
        [],
      ],
    });
    assertCorrectWorryLevelAtNRound(6, decreaseWorryLevelByTreeTimes, {
      items: [
        [8, 70, 176, 26, 34],
        [481, 32, 36, 186, 2190],
        [],
        [],
      ],
    });
    assertCorrectWorryLevelAtNRound(7, decreaseWorryLevelByTreeTimes, {
      items: [
        [162, 12, 14, 64, 732, 17],
        [148, 372, 55, 72],
        [],
        [],
      ],
    });
    assertCorrectWorryLevelAtNRound(8, decreaseWorryLevelByTreeTimes, {
      items: [
        [51, 126, 20, 26, 136],
        [343, 26, 30, 1546, 36],
        [],
        [],
      ],
    });
    assertCorrectWorryLevelAtNRound(9, decreaseWorryLevelByTreeTimes, {
      items: [
        [116, 10, 12, 517, 14],
        [108, 267, 43, 55, 288],
        [],
        [],
      ],
    });
    assertCorrectWorryLevelAtNRound(10, decreaseWorryLevelByTreeTimes, {
      items: [
        [91, 16, 20, 98],
        [481, 245, 22, 26, 1092, 30],
        [],
        [],
      ],
    });
    assertCorrectWorryLevelAtNRound(15, decreaseWorryLevelByTreeTimes, {
      items: [
        [83, 44, 8, 184, 9, 20, 26, 102],
        [
          110,
          36,
        ],
        [],
        [],
      ],
    });
    assertCorrectWorryLevelAtNRound(20, decreaseWorryLevelByTreeTimes, {
      items: [
        [10, 12, 14, 26, 34],
        [
          245,
          93,
          53,
          199,
          115,
        ],
        [],
        [],
      ],
      inspections: [101, 95, 7, 105],
    });
  });

  it("Calculates correct inspections counts after 10000 rounds with keeping worry level", () => {
    assertCorrectWorryLevelAtNRound(1, keepWorryLevel, {
      inspections: [2, 4, 3, 6],
    });
    assertCorrectWorryLevelAtNRound(20, keepWorryLevel, {
      inspections: [99, 97, 8, 103],
    });
    assertCorrectWorryLevelAtNRound(1000, keepWorryLevel, {
      inspections: [5204, 4792, 199, 5192],
    });
    assertCorrectWorryLevelAtNRound(2000, keepWorryLevel, {
      inspections: [10419, 9577, 392, 10391],
    });
    assertCorrectWorryLevelAtNRound(3000, keepWorryLevel, {
      inspections: [15638, 14358, 587, 15593],
    });
    assertCorrectWorryLevelAtNRound(4000, keepWorryLevel, {
      inspections: [20858, 19138, 780, 20797],
    });
    assertCorrectWorryLevelAtNRound(5000, keepWorryLevel, {
      inspections: [26075, 23921, 974, 26000],
    });
    assertCorrectWorryLevelAtNRound(6000, keepWorryLevel, {
      inspections: [31294, 28702, 1165, 31204],
    });
    assertCorrectWorryLevelAtNRound(7000, keepWorryLevel, {
      inspections: [36508, 33488, 1360, 36400],
    });
    assertCorrectWorryLevelAtNRound(8000, keepWorryLevel, {
      inspections: [41728, 38268, 1553, 41606],
    });
    assertCorrectWorryLevelAtNRound(9000, keepWorryLevel, {
      inspections: [46945, 43051, 1746, 46807],
    });
    assertCorrectWorryLevelAtNRound(10000, keepWorryLevel, {
      inspections: [52166, 47830, 1938, 52013],
    });
  });
});
