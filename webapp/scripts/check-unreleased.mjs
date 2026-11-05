// Fails if the compiled site contains work not yet in production, which wears test ids beginning `unreleased-`.
// Run after `compile`, on the build that ships. A missing or empty build fails too, rather than passing with nothing checked.
import {readdirSync, readFileSync} from "node:fs";
import {join} from "node:path";

const BUILD = join(import.meta.dirname, "..", "build");
const MARKER = "unreleased-";

const files = readdirSync(BUILD, {recursive: true, withFileTypes: true})
  .filter(entry => entry.isFile())
  .map(entry => join(entry.parentPath, entry.name));
if (files.length === 0) {
  console.error(`check-unreleased: nothing to check in ${BUILD}`);
  process.exit(1);
}

const leaks = files.filter(file => readFileSync(file).includes(MARKER));
if (leaks.length > 0) {
  console.error(`check-unreleased: "${MARKER}" found in:\n${leaks.join("\n")}`);
  process.exit(1);
}

console.log(`check-unreleased: ${files.length} files clean`);
