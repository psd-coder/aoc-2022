import { objectKeys } from "./utils.ts";
import { DayPartConfig, DayParts, DayResults } from "./types.ts";

export function day(parts: DayParts) {
  return (input: string) =>
    objectKeys(parts).reduce((acc, key) => {
      acc[key] = parts[key]?.(input);

      return acc;
    }, {} as DayResults);
}

export function part<ParsedData>({
  parser,
  solver,
}: DayPartConfig<ParsedData>) {
  return (input: string) => solver(parser(input));
}
