import { assert } from "/lib/utils.ts";

enum Direction {
  Up = "U",
  Right = "R",
  Down = "D",
  Left = "L",
}

type Position = { x: number; y: number };

interface Movement {
  dir: Direction;
  steps: number;
}

function assertDirection(value: string): asserts value is Direction {
  assert(
    Object.values<string>(Direction).includes(value),
    `Unknown dir: "${value}"`,
  );
}

export function parser(input: string) {
  const rows = input.split(/\n/);
  const movements = rows.map<Movement>((movementStr) => {
    const [dir, steps] = movementStr.split(/\s/);

    assertDirection(dir);

    return { dir, steps: parseInt(steps, 10) };
  });

  return movements;
}

function strPosition(pos: Position) {
  return `${pos.x}-${pos.y}`;
}

function moveKnot(pos: Position, dir: Direction): Position {
  switch (dir) {
    case Direction.Up:
      return { ...pos, y: pos.y - 1 };
    case Direction.Right:
      return { ...pos, x: pos.x + 1 };
    case Direction.Down:
      return { ...pos, y: pos.y + 1 };
    case Direction.Left:
      return { ...pos, x: pos.x - 1 };
  }
}

function simulateTailMovement(
  headPos: Position,
  tailPos: Position,
): Position {
  const xDiff = headPos.x - tailPos.x;
  const yDiff = headPos.y - tailPos.y;
  const xDiffAbs = Math.abs(xDiff);
  const yDiffAbs = Math.abs(yDiff);
  const xDiffSign = Math.sign(xDiff);
  const yDiffSign = Math.sign(yDiff);

  // Horizontal movement
  if (xDiffAbs > 1 && yDiff === 0) {
    return { x: tailPos.x + xDiffSign, y: tailPos.y };
  }

  // Vertical movement
  if (xDiff === 0 && yDiffAbs > 1) {
    return { x: tailPos.x, y: tailPos.y + yDiffSign };
  }

  // Diagonal movement
  if (xDiffAbs > 1) {
    return { y: headPos.y, x: tailPos.x + xDiffSign };
  }

  if (yDiffAbs > 1) {
    return { x: headPos.x, y: tailPos.y + yDiffSign };
  }

  return tailPos;
}

export function runMovements(movements: Movement[]) {
  let headPos: Position = { x: 0, y: 0 };
  let tailPos: Position = headPos;

  const tailVisitedPositions = new Set([strPosition(tailPos)]);

  movements.forEach((movement) => {
    console.log("---movement", movement);

    for (let i = 0; i < movement.steps; i++) {
      headPos = moveKnot(headPos, movement.dir);
      tailPos = simulateTailMovement(headPos, tailPos);
      console.log("   step", { headPos, tailPos });

      tailVisitedPositions.add(strPosition(tailPos));
    }
  });

  console.log(tailVisitedPositions);

  return tailVisitedPositions.size;
}
