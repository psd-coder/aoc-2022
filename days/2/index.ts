import { day, part } from "@lib/define";
import { arraySum } from "@lib/utils";

import {
  RealGameChoises,
  InstructionGameChoises,
  parser,
  getCalculateGameScore,
  ownChoiseSelector,
} from "./lib";

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
