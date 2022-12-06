export function parser(input: string) {
  const chars = input.split("");

  return chars;
}

function areAllCharsUnique(chars: string[]) {
  if (chars.length < 1) {
    return true;
  }

  for (let i = 1, ii = chars.length; i < ii; i++) {
    const previousChars = chars.slice(0, i);
    const char = chars[i];

    if (previousChars.includes(char)) {
      return false;
    }
  }

  return true;
}

export function findFirstNUniqueCharacters(chars: string[], groupSize: number) {
  for (let i = 0, ii = chars.length; i < ii; i++) {
    if (areAllCharsUnique(chars.slice(i, i + groupSize))) {
      return i;
    }
  }

  return -1;
}
