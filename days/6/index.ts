import { day, part } from "/lib/define.ts";

import { findFirstNUniqueCharacters, parser } from "./lib.ts";

const PACKET_UNIQUE_CHARS_SIZE = 4;
const MESSAGE_UNIQUE_CHARS_SIZE = 14;

export default day({
  part1: part({
    parser,
    solver: (chars) => {
      const firstPacketAt = findFirstNUniqueCharacters(
        chars,
        PACKET_UNIQUE_CHARS_SIZE,
      );

      return firstPacketAt + PACKET_UNIQUE_CHARS_SIZE;
    },
  }),
  part2: part({
    parser,
    solver: (chars) => {
      const firstMessageAt = findFirstNUniqueCharacters(
        chars,
        MESSAGE_UNIQUE_CHARS_SIZE,
      );

      return firstMessageAt + MESSAGE_UNIQUE_CHARS_SIZE;
    },
  }),
});
