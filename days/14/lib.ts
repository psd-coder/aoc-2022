type Point = { x: number; y: number };
type Rock = Point[];
type Input = {
  topLeft: Point;
  bottomRight: Point;
  rocks: Rock[];
};
enum TileType {
  Source = "+",
  Rock = "#",
  Air = ".",
  Sand = "o",
}
type Map = {
  topLeft: Point;
  bottomRight: Point;
  withFloor: boolean;
  tiles: TileType[][];
};

const SOURCE_POINT = { x: 500, y: 0 };
const FLOOR_OFFSET = 2;

function getTopLeftPoint(current: Point, point: Point) {
  return {
    x: Math.min(current.x, point.x),
    y: Math.min(current.y, point.y),
  };
}

function getBottomRightPoint(current: Point, point: Point) {
  return {
    x: Math.max(current.x, point.x),
    y: Math.max(current.y, point.y),
  };
}

export function parser(input: string): Input {
  const rows = input.split(/\n/);
  let topLeft: Point = SOURCE_POINT;
  let bottomRight: Point = SOURCE_POINT;
  const rocks = rows.map((row) => {
    const strPoints = row.split(" -> ");
    const points = strPoints.map((strPoint) => {
      const [strX, strY] = strPoint.split(",");
      const point = { x: parseInt(strX, 10), y: parseInt(strY, 10) };

      topLeft = getTopLeftPoint(topLeft, point);
      bottomRight = getBottomRightPoint(bottomRight, point);

      return point;
    });

    return points;
  });

  return {
    topLeft,
    bottomRight,
    rocks,
  };
}

function relative(topLeft: Point, point: Point) {
  return { x: point.x - topLeft.x, y: point.y - topLeft.y };
}

function setTile(map: Map, point: Point, tileType: TileType): void {
  const p = relative(map.topLeft, point);

  map.tiles[p.y][p.x] = tileType;
}

function drawPath(
  map: Map,
  fromPoint: Point,
  toPoint: Point,
  tileType: TileType,
): void {
  const drawableAxis = fromPoint.x !== toPoint.x ? "x" : "y";
  const from = Math.min(fromPoint[drawableAxis], toPoint[drawableAxis]);
  const to = Math.max(fromPoint[drawableAxis], toPoint[drawableAxis]);

  for (let i = from, ii = to; i <= ii; i++) {
    setTile(map, { ...fromPoint, [drawableAxis]: i }, tileType);
  }
}

export function buildMap(input: Input, withFloor: boolean) {
  const height = input.bottomRight.y - input.topLeft.y + 1 +
    (withFloor ? FLOOR_OFFSET : 0);
  const width = withFloor
    ? height * 2 + 1
    : input.bottomRight.x - input.topLeft.x + 1;
  const tiles = Array.from(
    { length: height },
    (_, i) => {
      const tileType = withFloor && i === height - 1
        ? TileType.Rock
        : TileType.Air;

      return Array.from({ length: width }, () => tileType);
    },
  );
  const map = {
    topLeft: withFloor
      ? { x: SOURCE_POINT.x - height, y: SOURCE_POINT.y }
      : input.topLeft,
    bottomRight: withFloor
      ? { x: SOURCE_POINT.x + height, y: SOURCE_POINT.y + height }
      : input.bottomRight,
    withFloor,
    tiles,
  };

  setTile(map, SOURCE_POINT, TileType.Source);
  input.rocks.forEach((rock) => {
    const pointsCount = rock.length;
    rock.forEach((rockPoint, i) => {
      if (i + 1 < pointsCount) {
        drawPath(map, rockPoint, rock[i + 1], TileType.Rock);
      }
    });
  });

  return map;
}

function isEmpty(map: Map, at: Point) {
  const p = relative(map.topLeft, at);
  const tileValue = map.tiles?.[p.y]?.[p.x];

  return tileValue === undefined || tileValue === TileType.Air;
}

function simulateNewSandPiece(
  map: Map,
  startPoint = SOURCE_POINT,
): Map | null {
  let current = startPoint;

  while (current.y <= map.bottomRight.y) {
    const down = { ...current, y: current.y + 1 };
    const downLeft = { x: current.x - 1, y: current.y + 1 };
    const downRight = { x: current.x + 1, y: current.y + 1 };

    if (isEmpty(map, down)) {
      current = down;
      continue;
    }

    if (isEmpty(map, downLeft)) {
      current = downLeft;
      continue;
    }

    if (isEmpty(map, downRight)) {
      current = downRight;
      continue;
    }

    setTile(map, current, TileType.Sand);

    return current === SOURCE_POINT ? null : map;
  }

  return null;
}

export function simulate(map: Map) {
  let ended = false;
  let currentMap: Map = map;
  let restSandCounter = 0;

  while (!ended) {
    const newMap = simulateNewSandPiece(map);

    if (newMap !== null) {
      currentMap = newMap;
      restSandCounter += 1;
    }

    ended = newMap === null;
  }

  return {
    map: currentMap,
    restSandCounter: restSandCounter + (map.withFloor ? 1 : 0),
  };
}

export function drawMap(map: Map) {
  return map.tiles.map((row) => row.join("")).join("\n");
}
