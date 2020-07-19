import DEBUG from "debug";
import { resolve, sep, parse } from "path";

const DEBUG_ROOT = "nh";

export const Debug = () => {
  let dirname: string;
  let filename: string;
  try {
    throw new Error("nifty trick");
  } catch (err) {
    const calleeLine = err.stack.split("\n ")[2];
    const [, callee] = /\((.*):[0-9]*:[0-9]*\)$/.exec(calleeLine);
    ({ dir: dirname, name: filename } = parse(callee));
  }
  DEBUG("nh:debug")({ dirname, filename });
  const ROOT = resolve(__dirname, "..");
  const path = [DEBUG_ROOT]
    .concat(
      dirname
        .replace(ROOT, "")
        .split(sep)
        .filter((segment) => segment !== "")
        .concat(filename)
    )
    .join(":");
  return DEBUG(path);
};
