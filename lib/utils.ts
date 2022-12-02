export const objectKeys = <Obj extends Record<string, unknown>>(
  object: Obj
): Array<keyof Obj & string> => Object.keys(object);

export function arraySum(numbers: number[]): number;
export function arraySum<V>(
  numbers: V[],
  valueMapper: (value: V) => number
): number;
export function arraySum<V>(numbers: V[], valueMapper?: (value: V) => number) {
  return numbers.reduce((acc, value) => {
    if (!valueMapper) {
      if (typeof value === "number") {
        return acc + value;
      }

      throw new Error(
        "You must either pass array of numbers or provide valueMappper param"
      );
    }

    return acc + valueMapper(value);
  }, 0);
}
