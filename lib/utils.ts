import { join } from "https://deno.land/std@0.167.0/path/mod.ts";

const END_LINE_BREAK = /\n$/;
function trimEndLineBreak(data: string) {
  return data.replace(END_LINE_BREAK, "");
}

export function readData(
  filePath: string,
  relativeImportMeta?: ImportMeta,
) {
  let fullPath = filePath;

  if (relativeImportMeta) {
    const dirname = new URL(".", relativeImportMeta.url).pathname;

    fullPath = join(dirname, filePath);
  }

  const data = Deno.readTextFileSync(fullPath);

  return trimEndLineBreak(data);
}
