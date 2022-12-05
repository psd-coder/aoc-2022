import { readFileSync, existsSync } from "fs";
import path from "path";

function exitWithError(message: string): never {
  console.error("\x1b[31m%s\x1b[31m", message);
  process.exit(1);
}

function parseDayParam() {
  const passedDay = process.argv.at(-1);

  if (process.argv.length <= 2 || !passedDay || !/^\d+$/.test(passedDay)) {
    exitWithError('You must pass valid day. Like "npm run solve 1"');
  }

  return parseInt(passedDay, 10);
}

function buildDayFolderPaths(day: number) {
  const dayFolderPath = path.resolve(__dirname, "../days", String(day));
  const daySolutionsPath = path.resolve(dayFolderPath, "index.ts");
  const dayInputPath = path.resolve(dayFolderPath, "input.txt");

  if (!existsSync(dayFolderPath)) {
    exitWithError(
      `Folder with solutions for the day you passed (${day}) isn't present`
    );
  }
  [dayInputPath, daySolutionsPath].forEach((filePath) => {
    if (!existsSync(filePath)) {
      exitWithError(`Solution file "${filePath}" isn't present`);
    }
  });

  return { daySolutionsPath, dayInputPath };
}

const END_LINE_BREAK = /\n$/;
function trimEndLineBreak(data: string) {
  return data.replace(END_LINE_BREAK, "");
}

function readData(dayInputPath: string) {
  const data = readFileSync(dayInputPath, "utf-8");

  return trimEndLineBreak(data);
}

async function main() {
  const passedDay = parseDayParam();
  const { daySolutionsPath, dayInputPath } = buildDayFolderPaths(passedDay);
  const { default: dayRunner } = await import(daySolutionsPath);
  const parsedData = readData(dayInputPath);
  const results = dayRunner(parsedData);

  [1, 2].forEach((partNumber) => {
    const key = `part${partNumber}`;

    console.log(
      "\x1b[36m%s\x1b[0m",
      `Part ${partNumber} answer: `,
      results[key] ?? "not solved"
    );
  });
}

main();
