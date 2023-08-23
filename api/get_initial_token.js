require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = "oob";
const tokenFilePath = "token.json";

(async () => {
  try {
    const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid`;

    console.log("Please visit the following URL to get an authorization code:");
    console.log(authUrl);

    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question("Enter the authorization code: ", async (code) => {
      try {
        const tokenUrl = "https://api.login.yahoo.com/oauth2/get_token";
        const response = await axios.post(
          tokenUrl,
          `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${Buffer.from(
                `${clientId}:${clientSecret}`
              ).toString("base64")}`,
            },
          }
        );

        const tokenData = {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expiry_date: Date.now() + response.data.expires_in * 1000,
        };

        fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData));
        console.log("Token saved to", tokenFilePath);

        readline.close();
      } catch (error) {
        console.error("Error obtaining initial access token:", error.message);
        readline.close();
      }
    });
  } catch (error) {
    console.error("Error obtaining initial access token:", error.message);
  }
})();