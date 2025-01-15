const { GoogleAuth } = require("google-auth-library");
const path = require("path");

async function getAccessToken() {
  const keyFile = path.join(__dirname, "../client-secret.json");
  const scopes = ["https://www.googleapis.com/auth/androidpublisher"];

  const auth = new GoogleAuth({
    keyFile,
    scopes,
  });

  const authClient = await auth.getClient();
  const accessToken = await authClient.getAccessToken();

  return accessToken.token;
}

async function getReviews() {
  const accessToken = await getAccessToken();
  console.log("Access Token:", accessToken);
  const packageName = "br.com.mobiup.sorocabarefrescos";
  const url = `https://www.googleapis.com/androidpublisher/v3/applications/${packageName}/reviews?access_token=${accessToken}`;

  try {
    const { default: fetch } = await import("node-fetch");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching reviews: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Reviews:", JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
  }
}

getReviews();
