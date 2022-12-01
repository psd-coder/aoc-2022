import { parseInput } from "./lib";

(async function main() {
  const caloriesPerElf = await parseInput();
  const sortedCaloriesPerElves = caloriesPerElf.sort((a, b) => b - a);
  const threeMostCaloriesElves = sortedCaloriesPerElves.slice(0, 3);

  console.log(threeMostCaloriesElves.reduce((acc, v) => acc + v, 0));
})();
