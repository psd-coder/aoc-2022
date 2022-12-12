import { day, part } from "/lib/define.ts";
import {
  buildGraph,
  buildNodesMap,
  findClosestPositionWay,
  findLowestPositions,
  findShortestWay,
  parser,
} from "./lib.ts";

export default day({
  part1: part({
    parser,
    solver: ({ start, end, heights }) => {
      const nodes = buildNodesMap(heights);
      const graph = buildGraph(nodes);

      return findShortestWay(graph, start, end);
    },
  }),
  part2: part({
    parser,
    solver: ({ end, heights }) => {
      const nodes = buildNodesMap(heights);
      const graph = buildGraph(nodes);
      const lowestPositions = findLowestPositions(nodes);

      return findClosestPositionWay(graph, lowestPositions, end);
    },
  }),
});
