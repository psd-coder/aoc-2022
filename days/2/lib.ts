import { readFile } from "fs/promises";
import path from "path";

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

export const getCalculateGameScore = ([
  elfChoise,
  ownChoise,
]: RealGameChoises) => {
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
};

export const parseInput = async <GameChoises>() => {
  const input = await readFile(path.resolve(__dirname, "./input.txt"), "utf-8");

  const gamesChoises = input.split(/\n/).reduce((acc, gameChoises: string) => {
    if (gameChoises) {
      const parsedLetters = gameChoises.split(/\s/);

      if (parsedLetters.length !== 2) {
        throw new Error("Wrong input format");
      }

      acc.push(parsedLetters as GameChoises);
    }

    return acc;
  }, [] as GameChoises[]);

  return gamesChoises;
};