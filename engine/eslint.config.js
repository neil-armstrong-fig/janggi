import {baseConfig} from "@janggi/shared/config/eslint.base.js";

// The rules of janggi: pure TypeScript with no React, no store and no DOM, which is why it is a package of its own.
// It may import the shared vocabulary and itself, by its own name — the way `shared` does, and for the same reason:
// it is compiled as raw source by whichever package imports it, so an `@src` alias would resolve into that package's
// tree. It is not in `shared` because `acceptance-tests` may import anything there, and a spec that recomputed its
// expectation from the engine would agree with it whatever the engine did; nothing may import `engine` but `webapp`
// and `api`.
export default baseConfig({
  tsconfigRootDir: import.meta.dirname,
  allowedPackages: ["@janggi/shared", "@janggi/engine"],
});
