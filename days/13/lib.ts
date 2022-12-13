import { arraySum, assertNonNullable } from "/lib/helpers.ts";

type PacketValue = number | number[];
type Packet = PacketValue[];
type PacketPair = [Packet, Packet];
type ComparisonResult = boolean | null;

export function parser(input: string): PacketPair[] {
  const pairsStr = input.split(/\n\n/);
  const packetPairs = pairsStr.map((pairStr) => {
    const [packet1, packet2] = pairStr.split(/\n/);
    const parsedPacket1 = JSON.parse(packet1);
    const parsedPacket2 = JSON.parse(packet2);

    return [parsedPacket1, parsedPacket2] as PacketPair;
  });

  return packetPairs;
}

function compareArrays(
  leftArr: PacketValue[],
  rightArr: PacketValue[],
): ComparisonResult {
  const mostLength = Math.max(leftArr.length, rightArr.length);

  for (let i = 0; i < mostLength; i++) {
    const left = leftArr[i];
    const right = rightArr[i];

    // Left runs out of items first, so it is ordered
    if (left === undefined && right !== undefined) {
      return true;
    }

    // Right runs out of items first, os it is unordered
    if (left !== undefined && right === undefined) {
      return false;
    }

    if (typeof left === "number" && typeof right === "number") {
      // Check next values if left and right are equal
      if (left === right) {
        continue;
      }

      // Is it ordered or not?
      return left < right;
    }

    if (Array.isArray(left) || Array.isArray(right)) {
      const arraysComparisonResult = compareArrays(
        Array.isArray(left) ? left : [left],
        Array.isArray(right) ? right : [right],
      );

      if (arraysComparisonResult === null) {
        continue;
      }

      return arraysComparisonResult;
    }
  }

  return null;
}

export function isPacketPairCorrectlyOrdered(
  [packet1, packet2]: PacketPair,
): boolean {
  const packetsComparisonResult = compareArrays(packet1, packet2);

  assertNonNullable(
    packetsComparisonResult,
    "Comparison result for packets can't be undeterminated",
  );

  return packetsComparisonResult;
}

export function getSumOfCorrectlyOrderedPairsIndexes(
  packetPairs: PacketPair[],
) {
  const orderedIndexes = packetPairs.reduce<number[]>(
    (acc, packetPair, index) => {
      if (isPacketPairCorrectlyOrdered(packetPair)) {
        acc.push(index + 1);
      }

      return acc;
    },
    [],
  );

  return arraySum(orderedIndexes);
}

const DIVIDER_A = [[2]];
const DIVIDER_B = [[6]];
export function getDividerIndexesResultForOrderedPairs(
  packetPairs: PacketPair[],
) {
  const flatPackets = packetPairs.reduce<Packet[]>((acc, pair) => {
    acc.push(...pair);
    return acc;
  }, []);
  const allPackets = [...flatPackets, DIVIDER_A, DIVIDER_B];

  const orderedPackets = allPackets.sort((aPacket, bPacket) => {
    switch (compareArrays(aPacket, bPacket)) {
      case null:
        return 0;
      case true:
        return -1;
      case false:
        return 1;
    }
  });

  const dividerAIndex = orderedPackets.indexOf(DIVIDER_A) + 1;
  const dividerBIndex = orderedPackets.indexOf(DIVIDER_B) + 1;

  return dividerAIndex * dividerBIndex;
}
