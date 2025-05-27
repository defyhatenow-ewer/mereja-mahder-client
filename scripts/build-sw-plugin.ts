import { Plugin } from "vite";
import esbuild from "esbuild";
import path from "path";

export default function buildServiceWorker(): Plugin {
  return {
    name: "compile-sw",
    apply: "build",
    async buildStart() {
      const swPath = path.resolve(__dirname, "../src/service-worker.ts");
      const outPath = path.resolve(__dirname, "../dist-sw/service-worker.js");

      await esbuild.build({
        entryPoints: [swPath],
        outfile: outPath,
        bundle: true,
        format: "iife",
        target: "es2015",
        platform: "browser",
        sourcemap: false,
        minify: false,
        define: {
          "self.__WB_MANIFEST": "[]", // dummy until workbox injects real manifest
        },
      });

      console.log(
        "[vite-plugin] ✅ Built service-worker.ts → dist-sw/service-worker.js"
      );
    },
  };
}
