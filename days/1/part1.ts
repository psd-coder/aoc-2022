import { parseInput } from "./lib";

(async function main() {
  const caloriesPerElf = await parseInput();

  console.log(Math.max(...caloriesPerElf));
})();
