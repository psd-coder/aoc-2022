export type PartNames = "part1" | "part2";
export type SolutionResult = string | number;

export type Parser<ParsedData> = (input: string) => ParsedData;
export type Solver<ParsedData> = (parsedData: ParsedData) => SolutionResult;

export type DayPartConfig<ParsedData> = {
  parser: Parser<ParsedData>;
  solver: Solver<ParsedData>;
};

export type DayPartRunner<ParsedData> = (parsed: ParsedData) => SolutionResult;

export type DayParts = { [K in PartNames]?: DayPartRunner<any> };
export type DayResults = { [K in PartNames]?: SolutionResult };
