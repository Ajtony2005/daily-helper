const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const extensionsPath = path.join(__dirname, "..", ".vscode", "extensions.json");

if (!fs.existsSync(extensionsPath)) {
  console.error(".vscode/extensions.json nem található!");
  process.exit(1);
}

const extensions = JSON.parse(
  fs.readFileSync(extensionsPath, "utf-8")
).recommendations;

extensions.forEach((ext) => {
  try {
    console.log(`Telepítés: ${ext}`);
    execSync(`code --install-extension ${ext}`, { stdio: "inherit" });
  } catch (err) {
    console.error(`Hiba a ${ext} telepítésekor:`, err.message);
  }
});
