import { day, part } from "/lib/define.ts";
import { arraySum } from "/lib/utils.ts";

import {
  getCalculateGameScore,
  InstructionGameChoises,
  ownChoiseSelector,
  parser,
  RealGameChoises,
} from "./lib.ts";

export default day({
  part1: part<RealGameChoises[]>({
    parser,
    solver: (gamesChoises) => {
      const gamesScores = gamesChoises.map(getCalculateGameScore);

      return arraySum(gamesScores);
    },
  }),
  part2: part<InstructionGameChoises[]>({
    parser,
    solver: (gamesChoises) => {
      const gamesScores = gamesChoises.map((gameChoises) => {
        const ownChoise = ownChoiseSelector(gameChoises);

        return getCalculateGameScore([gameChoises[0], ownChoise]);
      });

      return arraySum(gamesScores);
    },
  }),
});
