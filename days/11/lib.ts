import { assert, assertNonNullable } from "/lib/helpers.ts";

type MonkeyIndex = number;
export type WorryLevel = number;
export type Items = WorryLevel[];

const OLD_VALUE = "old" as const;
type Operand = typeof OLD_VALUE | number;
const KNOWN_OPERATORS = ["*", "+"] as const;
type Operator = typeof KNOWN_OPERATORS[number];

interface Operation {
  operator: Operator;
  left: Operand;
  right: Operand;
}

interface Test {
  divider: number;
  ifTrue: MonkeyIndex;
  ifFalse: MonkeyIndex;
}

interface Monkey {
  items: Items;
  operation: Operation;
  test: Test;
}

export type Inspections = Map<number, number>;

function parseMonkeyItems(startingRow: string) {
  const [, numbersStr] = startingRow.split(":");

  return numbersStr.split(",").map((numberStr) =>
    parseInt(numberStr.trim(), 10)
  );
}

const END_INT_REGEXP = /(\d+)$/;
function parseNumberAtTheEnd(str: string) {
  const matched = str.match(END_INT_REGEXP);

  assertNonNullable(
    matched,
    `String "${str}" doesn't contain integer at the end`,
  );

  return parseInt(matched[1], 10);
}

function parseOperand(operandStr: string) {
  if (operandStr === OLD_VALUE) {
    return OLD_VALUE;
  }

  return parseInt(operandStr, 10);
}

function assertKnownOperator(operator: string): asserts operator is Operator {
  assert(
    (<readonly string[]> KNOWN_OPERATORS).includes(operator),
    `Unknown operator "${operator}"`,
  );
}

function parseMonkeyOperation(operationFullRow: string) {
  const operationRow = operationFullRow.split("=")[1];
  const [leftStr, operator, rightStr] = operationRow.trim().split(/\s/);

  assertKnownOperator(operator);

  return {
    operator,
    left: parseOperand(leftStr),
    right: parseOperand(rightStr),
  };
}

function parseMonkeyTest(
  testRow: string,
  ifTrueRow: string,
  ifFalseRow: string,
): Test {
  return {
    divider: parseNumberAtTheEnd(testRow),
    ifTrue: parseNumberAtTheEnd(ifTrueRow),
    ifFalse: parseNumberAtTheEnd(ifFalseRow),
  };
}

function parseMonkeyData(monkeyData: string, dataIndex: number): Monkey {
  const [
    monkeyIndexRow,
    startingRow,
    operationRow,
    testRow,
    ifTrueRow,
    ifFalseRow,
  ] = monkeyData.trim().split(/\n/);

  assert(
    monkeyIndexRow === `Monkey ${dataIndex}:`,
    "Monkeys must be sorted by their indexes",
  );

  return {
    items: parseMonkeyItems(startingRow),
    operation: parseMonkeyOperation(operationRow),
    test: parseMonkeyTest(testRow, ifTrueRow, ifFalseRow),
  };
}

export function parser(input: string): Monkey[] {
  const monkeysData = input.split(/\n\n/);
  const monkeys = monkeysData.map(parseMonkeyData);

  return monkeys;
}

export function decreaseWorryLevelByTreeTimes(
  worryLevel: WorryLevel,
): WorryLevel {
  return Math.floor(worryLevel / 3);
}

export function keepWorryLevel(worryLevel: WorryLevel): WorryLevel {
  return worryLevel;
}

const OPERATIONS: Record<Operator, (left: number, right: number) => number> = {
  "*": (left, right) => left * right,
  "+": (left, right) => left + right,
};
function getOperandValue(oldValue: number, operand: Operand) {
  return operand === OLD_VALUE ? oldValue : operand;
}
export function getInspectionWorryLevel(
  oldValue: number,
  operation: Operation,
): WorryLevel {
  const fn = OPERATIONS[operation.operator];
  const updatedWorryLevel = fn(
    getOperandValue(oldValue, operation.left),
    getOperandValue(oldValue, operation.right),
  );

  return updatedWorryLevel;
}

export function getNewMonkeyIndex(
  worryLevel: WorryLevel,
  test: Test,
) {
  return worryLevel % test.divider === 0 ? test.ifTrue : test.ifFalse;
}

export function runNRounds(
  monkeys: Monkey[],
  rounds: number,
  reliefWorryLevel: (worryLevel: WorryLevel) => WorryLevel,
) {
  const clonedMonkeys: Monkey[] = structuredClone(monkeys);
  const monkeysCount = monkeys.length;
  const inspections: Inspections = new Map<number, number>();
  const denominator = monkeys.map((m) => m.test.divider).reduce((
    a,
    b,
  ) => a * b);

  for (let round = 0; round < rounds; round++) {
    for (let i = 0; i < monkeysCount; i++) {
      const monkey = clonedMonkeys[i];

      while (monkey.items.length) {
        const currentWorryLevel = monkey.items.shift()!;

        const newWorryLevel = getInspectionWorryLevel(
          currentWorryLevel,
          monkey.operation,
        );
        const boredWorryLevel = reliefWorryLevel(newWorryLevel);
        const decreasedWorryLevel = boredWorryLevel % denominator;
        const throwToMonkeyIndex = getNewMonkeyIndex(
          decreasedWorryLevel,
          monkey.test,
        );

        inspections.set(i, (inspections.get(i) ?? 0) + 1);
        clonedMonkeys[throwToMonkeyIndex].items.push(decreasedWorryLevel);
      }
    }
  }

  return { monkeys: clonedMonkeys, inspections };
}

export function getMonkeyBusinessLevel(
  inspections: Inspections,
  getTopNValues: number,
) {
  const inspectionCounts = Array.from(inspections.values());
  const sortedInspectionCounts = inspectionCounts.sort((a, b) => b - a);
  const topNValues = sortedInspectionCounts.slice(0, getTopNValues);

  return topNValues.reduce((acc, value) => acc * value, 1);
}
