// Lets `node --test` import the app's TypeScript as Next.js resolves it: maps the "@/" alias
// to src/, adds the ".ts" extension, and lets JSON be imported without an import attribute
// (the image manifests). Node strips the types itself; no dependency needed.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";

const src = pathToFileURL(`${process.cwd()}/src/`).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    const target = specifier.startsWith("@/") ? new URL(specifier.slice(2), src).href : specifier;
    try {
      return nextResolve(target, context);
    } catch (error) {
      const local = target.startsWith(".") || target.startsWith("file:");
      if (local && error?.code === "ERR_MODULE_NOT_FOUND") return nextResolve(`${target}.ts`, context);
      throw error;
    }
  },
  load(url, context, nextLoad) {
    if (url.endsWith(".json")) return nextLoad(url, { ...context, importAttributes: { type: "json" } });
    return nextLoad(url, context);
  },
});
