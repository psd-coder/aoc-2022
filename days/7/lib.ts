import { assert, assertNonNullable } from "/lib/helpers.ts";

// Tree
enum NodeType {
  Dir = "dir",
  File = "file",
}

interface Node {
  type: NodeType;
  name: string;
  parent: Dir | null;
}

interface Dir extends Node {
  type: NodeType.Dir;
  children: Node[];
}

interface File extends Node {
  type: NodeType.File;
  size: number;
}

enum Command {
  CD = "cd",
  LS = "ls",
}

function createDir(name: string, parent: Dir | null): Dir {
  return { type: NodeType.Dir, name, children: [], parent };
}

function createFile(name: string, size: number, parent: Dir): File {
  return { type: NodeType.File, name, size, parent };
}

function isDir(node: Node): node is Dir {
  return node.type === NodeType.Dir;
}

function isFile(node: Node): node is File {
  return node.type === NodeType.File;
}

// Parser
function isCommand(row: string) {
  return row.startsWith("$");
}

function parseCommand(row: string): { command: Command; arg: string } {
  const [command, arg] = row.replace(/^\$\s/, "").split(" ") as [
    Command,
    string,
  ];

  assert(
    Object.values(Command).includes(command),
    `Unknown command in the input: "${command}"`,
  );

  return { command, arg };
}

function parseLsOutputLine(row: string, parent: Dir) {
  const splittedRow = row.split(" ");

  if (row.startsWith("dir")) {
    return createDir(splittedRow[1], parent);
  }

  return createFile(splittedRow[1], parseInt(splittedRow[0], 10), parent);
}

export function parser(input: string): Dir {
  const rows = input.split(/\n/);
  const tree: Dir = createDir("/", null);
  let currentDir: Dir = tree;
  let lastCommand: Command;

  rows.forEach((row) => {
    if (isCommand(row)) {
      const { command, arg } = parseCommand(row);

      if (command === Command.CD) {
        switch (arg) {
          case "/": {
            currentDir = tree;
            break;
          }
          case "..": {
            assertNonNullable(
              currentDir.parent,
              "It is already the root directory, so it isn't possible go higher",
            );

            currentDir = currentDir.parent;
            break;
          }
          default: {
            let dir = currentDir.children.find(
              (node) => isDir(node) && node.name === arg,
            ) as Dir | undefined;

            if (!dir) {
              dir = createDir(arg, currentDir);
              currentDir.children.push(dir);
            }

            currentDir = dir;
          }
        }
      }

      lastCommand = command;
    } else if (lastCommand === Command.LS) {
      currentDir.children.push(parseLsOutputLine(row, currentDir));
    } else {
      throw new Error("Wrong input format");
    }
  });

  return tree;
}

function traverseNode(node: Node, nodeHandler: (node: Node) => void) {
  if (isDir(node)) {
    nodeHandler(node);
    node.children.forEach((child) => traverseNode(child, nodeHandler));
  } else if (isFile(node)) {
    nodeHandler(node);
  } else {
    throw new Error(
      `Traverse function doesn't support such tree node: "${node.type}"`,
    );
  }
}

export function logTree(tree: Dir) {
  console.log(
    JSON.stringify(
      structuredClone(tree),
      (_, value) => {
        if (typeof value === "object" && "parent" in value) {
          delete value.parent;
        }

        return value;
      },
      2,
    ),
  );
}

export function getDirSizesMap(tree: Dir) {
  const result = new Map<Dir, number>();

  traverseNode(tree, (node) => {
    if (isDir(node)) {
      if (result.has(node)) {
        throw new Error(
          `Directory with the name "${node.name}" already registered. Wrong traversing!`,
        );
      }

      result.set(node, 0);
    } else if (isFile(node)) {
      let parent = node.parent;

      while (parent) {
        const currentParentSize = result.get(parent);

        assertNonNullable(
          currentParentSize,
          "Directory must be first registered in the map. Wrong traversing!",
        );

        result.set(parent, currentParentSize + node.size);
        parent = parent.parent;
      }
    }
  });

  return result;
}
