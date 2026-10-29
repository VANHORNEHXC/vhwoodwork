const { compile } = require("@tailwindcss/node");
const { Scanner } = require("@tailwindcss/oxide");
const fs = require("fs");
const path = require("path");

async function buildCSS() {
  const rootDir = path.resolve(__dirname, "..");
  const inputPath = path.join(rootDir, "src/app/globals.input.css");
  const outputPath = path.join(rootDir, "src/app/globals.css");

  const css = fs.readFileSync(inputPath, "utf8");
  const compiler = await compile(css, {
    from: inputPath,
    base: rootDir,
    onDependency: () => {},
  });

  const scanner = new Scanner({
    sources: [
      { base: path.join(rootDir, "src"), pattern: "**/*", negated: false },
    ],
  });

  const candidates = scanner.scan();
  console.log(`[build-css] Scanned ${candidates.length} candidate classes.`);

  const builtCss = compiler.build(candidates);
  fs.writeFileSync(outputPath, builtCss, "utf8");
  console.log(`[build-css] Wrote ${builtCss.length} bytes to src/app/globals.css.`);
}

buildCSS().catch((err) => {
  console.error("[build-css] Failed:", err);
  process.exit(1);
});

