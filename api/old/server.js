require("dotenv").config();
const express = require("express");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = "oob";
const tokenFilePath = "token.json";

async function getAccessToken() {
  const authUrl = "https://api.login.yahoo.com/oauth2/request_auth";
  const tokenUrl = "https://api.login.yahoo.com/oauth2/get_token";
  const refreshTokenUrl = "https://api.login.yahoo.com/oauth2/get_token";

  try {
    const token = JSON.parse(fs.readFileSync(tokenFilePath));

    if (Date.now() > token.expiry_date) {
      console.log("Refreshing access token...");
      const refreshResponse = await axios.post(
        refreshTokenUrl,
        `grant_type=refresh_token&refresh_token=${token.refresh_token}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${clientId}:${clientSecret}`
            ).toString("base64")}`,
          },
        }
      );
      const newToken = {
        access_token: refreshResponse.data.access_token,
        refresh_token: token.refresh_token,
        expiry_date: Date.now() + refreshResponse.data.expires_in * 1000,
      };
      fs.writeFileSync(tokenFilePath, JSON.stringify(newToken));
      return newToken.access_token;
    } else {
      return token.access_token;
    }
  } catch (error) {
    console.error("Error reading token file:", error.message);
    throw new Error("Unable to obtain access token automatically");
  }
}

app.get("/api/yahoo", async (req, res) => {
  const endpoint = req.query.endpoint;

  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Error fetching data from Yahoo API");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
