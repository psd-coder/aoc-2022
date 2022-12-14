export const objectKeys = <Obj extends Record<string, unknown>>(
  object: Obj,
): Array<keyof Obj & string> => Object.keys(object);

export function arraySum(numbers: number[]): number;
export function arraySum<V>(
  numbers: V[],
  valueMapper: (value: V) => number,
): number;
export function arraySum<V>(numbers: V[], valueMapper?: (value: V) => number) {
  return numbers.reduce((acc, value) => {
    if (!valueMapper) {
      if (typeof value === "number") {
        return acc + value;
      }

      throw new Error(
        "You must either pass array of numbers or provide valueMappper param",
      );
    }

    return acc + valueMapper(value);
  }, 0);
}

export const filterBoolean = <T>(arr: T[]) =>
  arr.filter(Boolean) as Exclude<T, false | null | undefined>[];

export function countPositives(arr: boolean[]) {
  return arr.filter((value) => value).length;
}

export function assert(
  condition: boolean,
  message: string,
): asserts condition is true {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertNonNullable<V>(
  value: V | null | undefined,
  message: string,
): asserts value is NonNullable<V> {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}
