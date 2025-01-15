const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const gradleFilePath = path.join(__dirname, "../android/app/build.gradle");
const serviceAccountKeyPath = path.join(__dirname, "../credentials-publish.json");
const packageName = "br.com.mobiup.sorocabarefrescos";

async function getCurrentVersionCode() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: serviceAccountKeyPath,
      scopes: ["https://www.googleapis.com/auth/androidpublisher"],
    });

    const authClient = await auth.getClient();
    const androidPublisher = google.androidpublisher({
      version: "v3",
      auth: authClient,
    });

    const edits = await androidPublisher.edits.insert({ packageName });
    const editId = edits.data.id;

    const tracks = await androidPublisher.edits.tracks.get({
      packageName,
      editId,
      track: "production",
    });

    const currentVersionCodes = tracks.data.releases.map((release) => release.versionCodes).flat();
    const latestVersionCode = Math.max(...currentVersionCodes.map(Number));

    return latestVersionCode;
  } catch (error) {
    console.error("Error fetching current version code:", error);
    process.exit(1);
  }
}

async function updateAndroidVersion() {
  if (fs.existsSync(gradleFilePath)) {
    let gradleFileContent = fs.readFileSync(gradleFilePath, "utf8");

    const currentVersionCode = await getCurrentVersionCode();
    const newVersionCode = currentVersionCode + 1;

    // Increment the version name as well by adding a patch version
    const versionNameRegex = /versionName \"([\d.]+)\"/;
    const currentVersionNameMatch = gradleFileContent.match(versionNameRegex);
    let newVersionName = "1.0.0";

    if (currentVersionNameMatch) {
      const versionParts = currentVersionNameMatch[1].split(".");
      versionParts[versionParts.length - 1] = (parseInt(versionParts[versionParts.length - 1], 10) + 1).toString();
      newVersionName = versionParts.join(".");
    }

    gradleFileContent = gradleFileContent.replace(/versionCode (\d+)/, `versionCode ${newVersionCode}`);
    gradleFileContent = gradleFileContent.replace(versionNameRegex, `versionName "${newVersionName}"`);

    fs.writeFileSync(gradleFilePath, gradleFileContent, "utf8");
    console.log(`Updated Android versionCode to ${newVersionCode} and versionName to ${newVersionName}`);
  } else {
    console.error(`Android build.gradle file not found at ${gradleFilePath}`);
    process.exit(1);
  }
}

updateAndroidVersion().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});