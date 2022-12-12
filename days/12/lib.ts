import { assertNonNullable, filterBoolean } from "/lib/helpers.ts";
import dijkstra from "https://deno.land/x/dijkstra/mod.ts";

type HeightChar = string;
type HeightsMap = HeightChar[][];
type Height = number;
type Input = { start: Position; end: Position; heights: HeightsMap };

type Position = { x: number; y: number };
type StrPosition = `${Position["x"]}:${Position["y"]}`;
type Edges = Record<StrPosition, number>;
type Graph = Record<StrPosition, Edges>;
type EdgePrice = number | null;
type Node = { height: Height; relations: Position[] };
type NodesMap = Node[][];
type MapSize = { width: number; height: number };

const START_MARKER = "S";
const END_MARKER = "E";
const MARKERS_HEIGHT = {
  [START_MARKER]: "a",
  [END_MARKER]: "z",
};

export function parser(input: string): Input {
  let start;
  let end;
  const heights = input.split(/\n/).map((row, y) => {
    return row.split("").map((cell, x) => {
      switch (cell) {
        case START_MARKER:
          start = { x, y };
          cell = MARKERS_HEIGHT[START_MARKER];
          break;
        case END_MARKER:
          end = { x, y };
          cell = MARKERS_HEIGHT[END_MARKER];
          break;
      }

      return cell;
    });
  });

  assertNonNullable(start, "Can't find start marker");
  assertNonNullable(end, "Can't find end marker");

  return { start, end, heights };
}

const UNICODE_LC_A_CODE = 97;
export function getNodeHeight(char: string) {
  return char.charCodeAt(0) - UNICODE_LC_A_CODE + 1;
}

function getMapSize<V>(twoDimArray: V[][]): MapSize {
  assertNonNullable(twoDimArray[0], "Map must contain at least one row");

  return { width: twoDimArray[0].length, height: twoDimArray.length };
}

export function stringifyPosition({ x, y }: Position): StrPosition {
  return `${x}:${y}`;
}

export function getEdgePrice(
  targetHeight: Height,
  currentHeight: Height,
): EdgePrice {
  const diff = targetHeight - currentHeight;

  if (diff >= 0 && diff <= 1) {
    return 1;
  }

  if (diff < 0) {
    return Math.abs(diff);
  }

  return null;
}

function getNode(mapSize: MapSize, heights: HeightsMap, { x, y }: Position) {
  return {
    height: getNodeHeight(heights[y][x]),
    relations: filterBoolean([
      y > 0 && { x, y: y - 1 },
      y < mapSize.height - 1 && { x, y: y + 1 },
      x > 0 && { x: x - 1, y },
      x < mapSize.width - 1 && { x: x + 1, y },
    ]),
  };
}

export function buildNodesMap(heights: HeightsMap): NodesMap {
  const mapSize = getMapSize(heights);
  const nodes = heights.map((row, y) => {
    return row.map((_, x) => getNode(mapSize, heights, { x, y }));
  });

  return nodes;
}

export function buildGraph(nodes: NodesMap): Graph {
  const graph: Graph = {};

  nodes.forEach((row, y) => {
    row.forEach(({ height, relations }, x) => {
      graph[stringifyPosition({ x, y })] = relations.reduce<Edges>(
        (acc, position) => {
          const edgePrice = getEdgePrice(
            nodes[position.y][position.x].height,
            height,
          );

          if (edgePrice) {
            acc[stringifyPosition(position)] = edgePrice;
          }

          return acc;
        },
        {},
      );
    });
  });

  return graph;
}

export function findLowestPositions(nodes: NodesMap): Position[] {
  const lowestHeight = getNodeHeight("a");
  const lowestPositions: Position[] = [];

  nodes.forEach((row, y) => {
    row.forEach((node, x) => {
      if (node.height === lowestHeight) {
        lowestPositions.push({ x, y });
      }
    });
  });

  return lowestPositions;
}

export function findShortestWay(
  graph: Graph,
  from: Position,
  to: Position,
) {
  const path = dijkstra.find_path(
    graph,
    stringifyPosition(from),
    stringifyPosition(to),
  );

  return path.length - 1;
}

export function findClosestPositionWay(
  graph: Graph,
  startPositions: Position[],
  end: Position,
) {
  const ways = startPositions.reduce<number[]>((acc, start) => {
    try {
      acc.push(findShortestWay(graph, start, end));
    } catch {
      // Just ignore the positions which don't have way to the end point
    }

    return acc;
  }, []);

  return Math.min(...ways);
}
