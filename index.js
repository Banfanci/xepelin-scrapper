const express = require("express");
const bodyParser = require("body-parser");

const scrapper = require("./extractDataFromArticle.js");
const googleSheet = require("./googleSheet.js");
const webhookHandler = require("./postToWebhook.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const googleSheetId = "1B66yG75efaAixmUB6Gtu_nCNUmyujDbpaD4PoEb8SdA";

app.post("/getArticlesOfCategory", async (req, res) => {
  const { category, webhook } = req.body;
  res.status(200).json();
  const articles = await scrapper.getAllArticlesOfOneSection(category);
  await googleSheet.addSheetWithArticles(category, articles, googleSheetId);
  await webhookHandler.sendWebhookMessage(webhook, googleSheetId);
});

app.post("/getAllArticles", async (req, res) => {
  const { webhook } = req.body;
  res.status(200).json();
  const articles = await scrapper.getAllArticlesOfAllSections();
  await googleSheet.addSheetWithArticles(
    "All Articles",
    articles,
    googleSheetId
  );
  await webhookHandler.sendWebhookMessage(webhook, googleSheetId);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
