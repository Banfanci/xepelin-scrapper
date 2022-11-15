const fetch = require("node-fetch");

exports.sendWebhookMessage = async (url, googleSheetId) => {
  var url = new URL(url);
  const data = {
    email: "bflobos@uc.cl",
    link: `https://docs.google.com/spreadsheets/d/${googleSheetId}`,
  };

  // webhook message
  var messagePayload = JSON.stringify(data);

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: messagePayload,
  };

  await fetch(url, requestOptions);
};
