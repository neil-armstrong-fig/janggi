import {vitestBaseConfig} from "@janggi/shared/config/vitest.base.js";
import {defineConfig} from "vitest/config";

export default defineConfig({...vitestBaseConfig, resolve: {tsconfigPaths: true}});
