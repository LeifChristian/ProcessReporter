// AC6ebe7209c21cd5fbcdb66a63e691737f  <SID></SID>
// f58f183d568d483d462336332cdf4825

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

require("dotenv").config();

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const client = require("twilio")(accountSid, authToken);

// const accountSid = 'AC6ebe7209c21cd5fbcdb66a63e691737f';

const accountSid = "MG6a6e4c67fd4bc51cec5f8e1223cad360";
const authToken = "f58f183d568d483d462336332cdf4825";
const client = require("twilio")(accountSid, authToken);

client.messages
  .create({
    body: "Stats:",
    messagingServiceSid: "MG6a6e4c67fd4bc51cec5f8e1223cad360",
    to: "+14065390742",
  })
  .then((message) => console.log(message.sid))
  .done();
