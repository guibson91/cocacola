const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");

const versionFile = path.join(__dirname, "..", "src/environments/version.ts");

const now = new Date();
const timeZone = "America/Sao_Paulo";
const zonedTime = utcToZonedTime(now, timeZone);

const buildTime = format(zonedTime, "dd/MM/yyyy HH:mm", { timeZone });

const content = `export const currentVersion = {
  buildTime: '${buildTime}'
};`;



fs.writeFileSync(versionFile, content);
