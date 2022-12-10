import { assertNonNullable } from "../../lib/helpers.ts";
import _ from "../9/index.ts";

enum OperationType {
  Addx = "addx",
  Noop = "noop",
}

type Addx = {
  type: OperationType.Addx;
  arg: number;
};

type Noop = {
  type: OperationType.Noop;
};

type Operation = Addx | Noop;

type CycleValues = Map<number, number>;

const OP_CYCLES_COUNT: Record<OperationType, number> = {
  [OperationType.Addx]: 2,
  [OperationType.Noop]: 1,
};

function parseOperation(operationStr: string): Operation {
  const [opType, arg] = operationStr.split(/\s/);

  switch (opType) {
    case OperationType.Noop:
      return { type: OperationType.Noop };
    case OperationType.Addx:
      return { type: OperationType.Addx, arg: parseInt(arg, 10) };
  }

  throw new Error(`Unsupported operation: "${operationStr}"`);
}

export function parser(input: string): Operation[] {
  const strOperations = input.split(/\n/);
  const operations = strOperations.map(parseOperation);

  return operations;
}

function applyOperation(register: number, operation: Operation) {
  switch (operation.type) {
    case OperationType.Noop:
      return register;
    case OperationType.Addx:
      return register + operation.arg;
  }
}

export function collectCycleValues(
  operations: Operation[],
  initialRegister = 1,
): CycleValues {
  let register = initialRegister;
  const cycleValues = new Map<number, number>();
  let cycle = 0;

  while (operations.length) {
    const operation = operations.shift()!;
    const operationCyclesCount = OP_CYCLES_COUNT[operation.type];

    for (let i = 0; i < operationCyclesCount; i++) {
      cycleValues.set(cycle, register);
      cycle += 1;

      if (i === operationCyclesCount - 1) {
        register = applyOperation(register, operation);
      }
    }
  }

  // Collect register value after applying all operations
  cycleValues.set(cycle, register);

  return cycleValues;
}

export function calculateSignalStrength(
  cycleValues: CycleValues,
  targetCycles: number[],
) {
  const cycleStrength = targetCycles.map((cycle) => {
    const cycleValue = cycleValues.get(cycle - 1);

    assertNonNullable(cycleValue, `Can't get value for cycle "${cycle}"`);

    const strength = cycle * cycleValue;

    return strength;
  });

  return cycleStrength;
}

const SCREEN_WIDTH = 40;
const SCREEN_HEIGHT = 6;
const EmptyPixel = ".";
const FilledPixel = "#";
type Pixel = typeof EmptyPixel | typeof FilledPixel;
type Image = Pixel[];

export function drawImage(cycleValues: CycleValues): Image {
  const image = Array.from<number, Pixel>(
    { length: SCREEN_WIDTH * SCREEN_HEIGHT },
    () => EmptyPixel,
  );

  cycleValues.forEach((spriteMiddlePosition, cycle) => {
    const rowIndex = cycle % SCREEN_WIDTH;

    if (
      rowIndex >= spriteMiddlePosition - 1 &&
      rowIndex <= spriteMiddlePosition + 1
    ) {
      image[cycle] = FilledPixel;
    }
  });

  return image;
}

export function renderImage(image: Image) {
  const imageLines = Array.from({ length: SCREEN_HEIGHT }, (_, i) => {
    const rowPixels = image.slice(i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH);
    const imageLine = rowPixels.join("");

    return imageLine;
  });

  return `\n${imageLines.join("\n")}\n`;
}
