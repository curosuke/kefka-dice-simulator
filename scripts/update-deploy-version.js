const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");

const deployVersion = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\.\d{3}Z$/, "Z");

let html = fs.readFileSync(indexPath, "utf8");

html = html.replace(
  /window\.__DEPLOY_VERSION__ = "[^"]+";/,
  `window.__DEPLOY_VERSION__ = "${deployVersion}";`
);
html = html.replace(/styles\.css\?v=[^"]+/g, `styles.css?v=${deployVersion}`);
html = html.replace(/app\.js\?v=[^"]+/g, `app.js?v=${deployVersion}`);

fs.writeFileSync(indexPath, html, "utf8");

console.log(`Updated deploy version: ${deployVersion}`);
