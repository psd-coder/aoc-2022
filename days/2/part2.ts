import {
  parseInput,
  getCalculateGameScore,
  ElfChoise,
  OwnChoise,
  InstructionGameChoises,
  GameResult,
} from "./lib";

const ownChoiseSelector = ([elfChoise, ownLetter]: InstructionGameChoises) => {
  const ownChoiseValues = Object.values(OwnChoise);
  const elfChoiseIndex = Object.values(ElfChoise).indexOf(elfChoise);

  if (ownLetter === GameResult.Draw) {
    return ownChoiseValues[elfChoiseIndex];
  }

  const ownChoiseIndex = (() => {
    const choiseModifier = ownLetter === GameResult.Lost ? -1 : +1;
    const initialOwnChoiseIndex = elfChoiseIndex + choiseModifier;

    if (initialOwnChoiseIndex < 0) {
      return ownChoiseValues.length - 1;
    }

    if (initialOwnChoiseIndex > ownChoiseValues.length - 1) {
      return 0;
    }

    return initialOwnChoiseIndex;
  })();

  return ownChoiseValues[ownChoiseIndex];
};

async function main() {
  const gamesChoises = await parseInput<InstructionGameChoises>();
  const gamesScores = gamesChoises.map((gameChoises) => {
    const ownChoise = ownChoiseSelector(gameChoises);

    return getCalculateGameScore([gameChoises[0], ownChoise]);
  });

  console.log(gamesScores.reduce((acc, score) => acc + score, 0));
}

main();
