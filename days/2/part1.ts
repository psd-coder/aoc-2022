import { parseInput, getCalculateGameScore, RealGameChoises } from "./lib";

async function main() {
  const gamesChoises = await parseInput<RealGameChoises>();
  const gamesScores = gamesChoises.map(getCalculateGameScore);

  console.log(gamesScores.reduce((acc, score) => acc + score, 0));
}

main();
