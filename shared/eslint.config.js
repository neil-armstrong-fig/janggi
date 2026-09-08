import {baseConfig} from "./config/eslint.base.js";

// `shared` is the bottom of the dependency graph — it may not import any other workspace package.
export default baseConfig({tsconfigRootDir: import.meta.dirname});
