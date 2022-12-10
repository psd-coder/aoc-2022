import { assertNonNullable } from "/lib/helpers.ts";

type StackName = string;
type StackSupplies = string[];
type Stack = { name: StackName; supplies: StackSupplies };

type Command = {
  from: StackName;
  to: StackName;
  count: number;
};

const STACK_COLUMN_WIDTH = 3;
const STACKS_SEPARATOR_WIDTH = 1;
function parseStacks(stackInput: string): Stack[] {
  const rows = stackInput.split(/\n/).reverse();
  const stackNames = rows.splice(0, 1)[0];
  const stacks: Stack[] = stackNames
    .trim()
    .split(/\s+/)
    .map((name) => ({ name, supplies: [] }));

  stacks.forEach(({ supplies }, stackIndex) => {
    rows.forEach((row) => {
      const isFirstCrate = stackIndex === 0;
      const separatorOffset = isFirstCrate
        ? 0
        : STACKS_SEPARATOR_WIDTH * stackIndex;
      const offset = stackIndex * STACK_COLUMN_WIDTH + separatorOffset;
      const crate = row.slice(offset, offset + STACK_COLUMN_WIDTH);

      if (crate.trim()) {
        const supply = crate.slice(1, -1);

        supplies.push(supply);
      }
    });
  });

  return stacks;
}

const COMMAND_REGEXP = /^move\s(\d+)\sfrom\s(\d+)\sto\s(\d+)$/;
function parseCommands(commandsInput: string) {
  const commands = commandsInput
    .split(/\n/)
    .reduce((acc, commandStr: string) => {
      if (commandStr) {
        const match = commandStr.match(COMMAND_REGEXP);

        assertNonNullable(match, `Unsupported command format: "${commandStr}"`);

        acc.push({
          from: match[2],
          to: match[3],
          count: parseInt(match[1]),
        });
      }

      return acc;
    }, [] as Command[]);

  return commands;
}

export function parser(input: string) {
  const [stacksInput, commandsInput] = input.split(/\n\n/);

  return {
    stacks: parseStacks(stacksInput),
    commands: parseCommands(commandsInput),
  };
}

export function applyCommands(
  stacks: Stack[],
  commands: Command[],
  getMovedItems: (
    fromStackSupplies: StackSupplies,
    count: number,
  ) => StackSupplies,
) {
  const stackIndexes = stacks.reduce((acc, { name }, index) => {
    acc[name] = index;

    return acc;
  }, {} as Record<StackName, number>);
  const resultStacks = structuredClone(stacks);

  commands.forEach((command) => {
    const fromStack = resultStacks[stackIndexes[command.from]].supplies;
    const toStack = resultStacks[stackIndexes[command.to]].supplies;
    const movedItems = getMovedItems(fromStack, command.count);

    fromStack.splice(command.count * -1);
    toStack.push(...movedItems);
  });

  return resultStacks;
}

export function getMovedItemsByOne(
  stackSupplies: StackSupplies,
  count: number,
) {
  return stackSupplies.slice(count * -1).reverse();
}

export function getMovedItemsByGroup(
  stackSupplies: StackSupplies,
  count: number,
) {
  return stackSupplies.slice(count * -1);
}

export function getTopStackSupplies(stacks: Stack[]) {
  return stacks.map(({ supplies }) => supplies.at(-1));
}
