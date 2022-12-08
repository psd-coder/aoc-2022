type TreeHeight = number;
type TreesRow = TreeHeight[];
type TreesMap = TreesRow[];
type MapSize = {
  rowSize: number;
  columnSize: number;
};

export function parser(input: string) {
  const rows = input.split(/\n/);
  const treesMap = rows.map((row) =>
    row.split("").map((height) => parseInt(height, 10))
  );

  return treesMap;
}

function iterateOverTreesMap(
  treesMap: TreesMap,
  handle: (rowIndex: number, columnIndex: number) => void
) {
  treesMap.forEach((row, rowIndex) =>
    row.forEach((_, columnIndex) => handle(rowIndex, columnIndex))
  );
}

function getMapSize(treesMap: TreesMap): MapSize {
  return {
    columnSize: treesMap.length,
    rowSize: treesMap[0].length,
  };
}

function isOnEdge({
  mapSize,
  rowIndex,
  columnIndex,
}: {
  mapSize: MapSize;
  rowIndex: number;
  columnIndex: number;
}) {
  return (
    rowIndex === 0 ||
    rowIndex === mapSize.rowSize - 1 ||
    columnIndex === 0 ||
    columnIndex === mapSize.columnSize - 1
  );
}

// Visibility check
function getRowTrees(row: TreesRow, from: number, to: number) {
  return row.slice(from, to);
}

function getColumnTrees(
  treesMap: TreesMap,
  columnIndex: number,
  from: number,
  to: number
) {
  const trees = [];

  for (let i = from; i < to; i++) {
    trees.push(treesMap[i][columnIndex]);
  }

  return trees;
}

function areAllTreesSmaller(
  targetHeight: TreeHeight,
  compareWith: TreeHeight[]
) {
  return compareWith.every((treeHeight) => treeHeight < targetHeight);
}

export function isVisible(
  treesMap: TreesMap,
  rowIndex: number,
  columnIndex: number
) {
  const mapSize = getMapSize(treesMap);

  if (isOnEdge({ mapSize, rowIndex, columnIndex })) {
    return true;
  }

  const treesRow = treesMap[rowIndex];
  const currentTreeHeight = treesRow[columnIndex];
  const treesGettersToCheck = [
    /* ⬆️ */ () => getColumnTrees(treesMap, columnIndex, 0, rowIndex),
    /* ⬇️ */ () =>
      getColumnTrees(treesMap, columnIndex, rowIndex + 1, mapSize.columnSize),
    /* ⬅️ */ () => getRowTrees(treesRow, 0, columnIndex),
    /* ➡️ */ () => getRowTrees(treesRow, columnIndex + 1, mapSize.rowSize),
  ];

  for (let i = 0, ii = treesGettersToCheck.length; i < ii; i++) {
    const trees = treesGettersToCheck[i]();

    if (areAllTreesSmaller(currentTreeHeight, trees)) {
      return true;
    }
  }

  return false;
}

export function countVisibleTrees(treesMap: TreesMap) {
  let visibleCount = 0;

  iterateOverTreesMap(treesMap, (rowIndex, columnIndex) => {
    if (isVisible(treesMap, rowIndex, columnIndex)) {
      visibleCount += 1;
    }
  });

  return visibleCount;
}

// Viewing distance check
interface Range {
  from: number;
  to: number;
}

function isRange(v: number | Range): v is Range {
  return typeof v === "object";
}

function countVisibleDistance(
  treesMap: TreesMap,
  rowIndex: Range,
  columnIndex: number,
  treeHeight: TreeHeight
): number;
function countVisibleDistance(
  treesMap: TreesMap,
  rowIndex: number,
  columnIndex: Range,
  treeHeight: TreeHeight
): number;
function countVisibleDistance(
  treesMap: TreesMap,
  rowIndex: number | Range,
  columnIndex: number | Range,
  treeHeight: TreeHeight
) {
  let visibleTreesCount = 0;
  // We already know from overrides types that either rowIndex or columnIndex is range
  const { from, to } = (isRange(rowIndex) ? rowIndex : columnIndex) as Range;
  const isAscending = from < to;
  const isContinue = (i: number) => (isAscending ? i <= to : i >= to);
  let increment = isAscending ? 1 : -1;

  for (let i = from; isContinue(i); i += increment) {
    visibleTreesCount += 1;
    const rIndex = isRange(rowIndex) ? i : rowIndex;
    const cIndex = isRange(columnIndex) ? i : columnIndex;

    if (treesMap[rIndex][cIndex] >= treeHeight) {
      break;
    }
  }

  return visibleTreesCount;
}

export function calculateTreeScenicScore(
  treesMap: TreesMap,
  rowIndex: number,
  columnIndex: number
) {
  const mapSize = getMapSize(treesMap);
  const currentTreeHeight = treesMap[rowIndex][columnIndex];

  if (isOnEdge({ mapSize, rowIndex, columnIndex })) {
    return 0;
  }

  const treeVisibility = [
    /* ⬆️ */ countVisibleDistance(
      treesMap,
      { from: rowIndex - 1, to: 0 },
      columnIndex,
      currentTreeHeight
    ),
    /* ⬇️ */ countVisibleDistance(
      treesMap,
      {
        from: rowIndex + 1,
        to: mapSize.columnSize - 1,
      },
      columnIndex,
      currentTreeHeight
    ),
    /* ⬅️ */ countVisibleDistance(
      treesMap,
      rowIndex,
      { from: columnIndex - 1, to: 0 },
      currentTreeHeight
    ),
    /* ➡️ */ countVisibleDistance(
      treesMap,
      rowIndex,
      {
        from: columnIndex + 1,
        to: mapSize.rowSize - 1,
      },
      currentTreeHeight
    ),
  ];

  const scenicScore = treeVisibility.reduce(
    (acc, visibility) => acc * visibility,
    1
  );

  return scenicScore;
}

export function calculateBestScenicScore(treesMap: TreesMap) {
  let bestScenicScore = 0;

  iterateOverTreesMap(treesMap, (rowIndex, columnIndex) => {
    const treeScenicScore = calculateTreeScenicScore(
      treesMap,
      rowIndex,
      columnIndex
    );

    if (treeScenicScore > bestScenicScore) {
      bestScenicScore = treeScenicScore;
    }
  });

  return bestScenicScore;
}
