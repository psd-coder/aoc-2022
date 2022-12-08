import { join } from "https://deno.land/std@0.167.0/path/mod.ts";

function exitWithError(message: string): never {
  console.error("\x1b[31m%s\x1b[31m", message);
  Deno.exit(1);
}

function parseDayParam() {
  const passedDay = Deno.args[0];

  if (Deno.args.length < 1 || !passedDay || !/^\d+$/.test(passedDay)) {
    exitWithError('You must pass valid day. Like "npm run solve 1"');
  }

  return parseInt(passedDay, 10);
}

function buildDayFolderPaths(day: number) {
  const dayFolderPath = join("./days", String(day));
  const daySolutionsPath = join(dayFolderPath, "index.ts");
  const dayInputPath = join(dayFolderPath, "input.txt");

  try {
    Deno.statSync(dayFolderPath);
  } catch {
    exitWithError(
      `Folder with solutions for the day you passed (${day}) isn't present`,
    );
  }

  [dayInputPath, daySolutionsPath].forEach((filePath) => {
    try {
      Deno.statSync(filePath);
    } catch {
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
  const data = Deno.readTextFileSync(dayInputPath);

  return trimEndLineBreak(data);
}

async function main() {
  const passedDay = parseDayParam();
  const { daySolutionsPath, dayInputPath } = buildDayFolderPaths(passedDay);
  const { default: dayRunner } = await import(`../${daySolutionsPath}`);
  const parsedData = readData(dayInputPath);
  const results = dayRunner(parsedData);

  [1, 2].forEach((partNumber) => {
    const key = `part${partNumber}`;

    console.log(
      "\x1b[36m%s\x1b[0m",
      `Part ${partNumber} answer: `,
      results[key] ?? "not solved",
    );
  });
}

main();
