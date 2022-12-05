type Range = [number, number];
type PairRanges = [Range, Range];

export function parser(input: string) {
  const pairsRanges = input.split(/\n/).map((pairRangesStr: string) => {
    const pairRanges = pairRangesStr.split(",");
    const parsedPairRanges = pairRanges.map((elfRange) => {
      const parsedElfRange = elfRange
        .split("-")
        .map((rangeNum) => parseInt(rangeNum, 10));

      return parsedElfRange as Range;
    }) as PairRanges;

    return parsedPairRanges as PairRanges;
  });

  return pairsRanges;
}

function isFullyInRange(range: Range, comparisonRange: Range) {
  return range[0] >= comparisonRange[0] && range[1] <= comparisonRange[1];
}

export function isFullyOverlap(pairRanges: PairRanges) {
  const [firstRange, secondRange] = pairRanges;

  return (
    isFullyInRange(firstRange, secondRange) ||
    isFullyInRange(secondRange, firstRange)
  );
}

export function isIntersect(pairRanges: PairRanges) {
  const [firstRange, secondRange] = pairRanges;
  const isFirstHasLowerStartIndex = firstRange[0] <= secondRange[0];
  const rangeWithLowerStartIndex = isFirstHasLowerStartIndex
    ? firstRange
    : secondRange;
  const rangeWithHigherStartIndex = isFirstHasLowerStartIndex
    ? secondRange
    : firstRange;

  return (
    rangeWithHigherStartIndex[0] >= rangeWithLowerStartIndex[0] &&
    rangeWithHigherStartIndex[0] <= rangeWithLowerStartIndex[1]
  );
}
