import { assert } from "@lib/utils";

export enum ElfChoise {
  Rock = "A",
  Paper = "B",
  Scissors = "C",
}

export enum OwnChoise {
  Rock = "X",
  Paper = "Y",
  Scissors = "Z",
}

export enum GameResult {
  Lost = "X",
  Draw = "Y",
  Win = "Z",
}

export type RealGameChoises = [ElfChoise, OwnChoise];
export type InstructionGameChoises = [ElfChoise, GameResult];

const RESULT_PRICE = {
  [GameResult.Lost]: 0,
  [GameResult.Draw]: 3,
  [GameResult.Win]: 6,
};
const CHOISE_PRICE = {
  [OwnChoise.Rock]: 1,
  [OwnChoise.Paper]: 2,
  [OwnChoise.Scissors]: 3,
};

export function parser<GameChoises>(input: string) {
  const gamesChoises = input.split(/\n/).reduce((acc, gameChoises: string) => {
    if (gameChoises) {
      const parsedLetters = gameChoises.split(/\s/);

      assert(parsedLetters.length === 2, "Wrong input format");

      acc.push(parsedLetters as GameChoises);
    }

    return acc;
  }, [] as GameChoises[]);

  return gamesChoises;
}

export function getCalculateGameScore([elfChoise, ownChoise]: RealGameChoises) {
  const elfChoiseIndex = Object.values(ElfChoise).indexOf(elfChoise);
  const ownChoiseIndex = Object.values(OwnChoise).indexOf(ownChoise);
  const resultPrice = (() => {
    const isDraw = elfChoiseIndex === ownChoiseIndex;

    if (isDraw) {
      return GameResult.Draw;
    }

    const isWin =
      ownChoiseIndex - elfChoiseIndex === 1 ||
      (ownChoise === OwnChoise.Rock && elfChoise === ElfChoise.Scissors);

    return isWin ? GameResult.Win : GameResult.Lost;
  })();

  return RESULT_PRICE[resultPrice] + CHOISE_PRICE[ownChoise];
}

export function ownChoiseSelector([
  elfChoise,
  ownLetter,
]: InstructionGameChoises) {
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
}
