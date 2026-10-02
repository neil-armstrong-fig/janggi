import {baseConfig} from "@janggi/shared/config/eslint.base.js";

// The infrastructure imports no other package in the workspace: it names the Worker's entry file and its migrations by
// path, and has them bundled and uploaded, which is not an import.
export default baseConfig({tsconfigRootDir: import.meta.dirname, allowedPackages: []});
