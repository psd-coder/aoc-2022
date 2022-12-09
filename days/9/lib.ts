import { assert } from "/lib/utils.ts";

enum Direction {
  Up = "U",
  Right = "R",
  Down = "D",
  Left = "L",
}
type Movement = {
  dir: Direction;
  steps: number;
};

type Knot = { x: number; y: number };
type Rope = Knot[];

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

export function getRope(knots: number): Rope {
  return Array.from({ length: knots }, () => ({ x: 0, y: 0 }));
}

function moveHead(knot: Knot, dir: Direction): Knot {
  switch (dir) {
    case Direction.Up:
      return { x: knot.x, y: knot.y - 1 };
    case Direction.Right:
      return { x: knot.x + 1, y: knot.y };
    case Direction.Down:
      return { x: knot.x, y: knot.y + 1 };
    case Direction.Left:
      return { x: knot.x - 1, y: knot.y };
  }
}

function followHead(
  headKnot: Knot,
  tailKnot: Knot,
): Knot {
  const xDiff = headKnot.x - tailKnot.x;
  const yDiff = headKnot.y - tailKnot.y;

  if (Math.abs(xDiff) < 2 && Math.abs(yDiff) < 2) {
    return tailKnot;
  }

  return {
    x: tailKnot.x + Math.sign(xDiff),
    y: tailKnot.y + Math.sign(yDiff),
  };
}

function getLastKnotCoordinates(rope: Rope) {
  const lastKnot = rope[rope.length - 1];

  return `${lastKnot.x},${lastKnot.y}`;
}

export function runSimulation(
  rope: Rope,
  movements: Movement[],
) {
  const knotsCount = rope.length;

  assert(
    knotsCount >= 2,
    "Rope must contain at least two knots: Head and Tail",
  );

  const tailVisitedPositions = new Set([getLastKnotCoordinates(rope)]);

  movements.forEach((movement) => {
    for (let step = 0; step < movement.steps; step++) {
      rope[0] = moveHead(rope[0], movement.dir);

      for (let knotIndex = 1; knotIndex < knotsCount; knotIndex++) {
        rope[knotIndex] = followHead(
          rope[knotIndex - 1],
          rope[knotIndex],
        );
      }

      tailVisitedPositions.add(getLastKnotCoordinates(rope));
    }
  });

  return tailVisitedPositions.size;
}
