var request = require("request");
const fs = require("fs");
var axios = require("axios");

let interval = 60000;

var sentItems = [];
let newItems = [];
var items = [];

var trueFalse = false;

var options = {
  method: "POST",
  url: "https://zabbix.unitedlocating.net/api_jsonrpc.php",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "problem.get",
    params: {
      output: "extend",
      selectAcknowledges: "extend",
      selectTags: "extend",
      selectSuppressionData: "extend",
      recent: "true",
      sortfield: ["eventid"],
      sortorder: "DESC",
      acknowledged: "0",
    },
    auth: "feddab2dfbf4d30b63b1383def84b6d1",
    id: 2,
  }),
};

let goTeam = async () => {
  request(options, function (error, response) {
    if (error) throw new Error(error);
    let thedata = JSON.parse(response.body);
    // console.log(result);console.log(thedata.result[0].name);console.log(thedata.result);console.log(thedata.length);

    for (let i in thedata.result) {
      let thetime = new Date(thedata.result[i].clock * 1000).toLocaleTimeString(
        "en-US"
      );

      let item = {
        name: thedata.result[i].name,
        Eventid: thedata.result[i].eventid,
        Objectid: thedata.result[i].objectid,
        clock: thetime,
      };

      if (items.some((thing) => thing.Objectid == item.Objectid)) {
        var newArray = items.filter(
          (thing) => thing.Objectid !== item.Objectid
        );
        sendEmail(newArray);
      } else {
        items.push(item);
        sendEmail(items);
      }

      console.log("current reported problems:", items);
    }
  });

  const sendEmail = async (items) => {
    if (items.length > 0) {
      const readline = require("readline");
      const { google } = require("googleapis");

      // If modifying these scopes, delete token.json.
      var SCOPES = [
        "https://mail.google.com/",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/gmail.send",
      ];
      // The file token.json stores the user's access and refresh tokens, and is
      // created automatically when the authorization flow completes for the first
      // time.

      const TOKEN_PATH = "../../token.json";

      fs.readFile("credentials.json", (err, content) => {
        if (err) return console.log("Error loading client secret file:", err);
        // Authorize a client with credentials, then call the Gmail API.
        authorize(JSON.parse(content), listLabels);
      });

      /**
       * Create an OAuth2 client with the given credentials, and then execute the
       * given callback function.
       * @param {Object} credentials The authorization client credentials.
       * @param {function} callback The callback to call with the authorized client.
       */
      function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } =
          credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
          client_id,
          client_secret,
          redirect_uris[0]
        );

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) return getNewToken(oAuth2Client, callback);
          oAuth2Client.setCredentials(JSON.parse(token));
          callback(oAuth2Client);
        });
      }

      /**
       * Get and store new token after prompting for user authorization, and then
       * execute the given callback with the authorized OAuth2 client.
       * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
       * @param {getEventsCallback} callback The callback for the authorized client.
       */
      function getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: "offline",
          scope: SCOPES,
        });
        console.log("Authorize this app by visiting this url:", authUrl);
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question("Enter the code from that page here: ", (code) => {
          rl.close();
          oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error("Error retrieving access token", err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
              if (err) return console.error(err);
              console.log("Token stored to", TOKEN_PATH);
            });
            callback(oAuth2Client);
          });
        });
      }

      /**
       * Lists the labels in the user's account.
       *
       * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
       */
      function listLabels(auth) {
        const gmail = google.gmail({ version: "v1", auth });
        gmail.users.labels.list(
          {
            userId: "me",
          },
          (err, res) => {
            if (err) return console.log("The API returned an error: " + err);
            const labels = res.data.labels;
            // if (labels.length) {
            //   console.log("Labels:");
            //   labels.forEach((label) => {
            //     console.log(`- ${label.name}`);
            //   });
            // } else {
            //   console.log("No labels found.");
            // }
          }
        );
      }

      function makeBody(to, from, subject, message) {
        var str = [
          'Content-Type: text/plain; charset="UTF-8"\n',
          "MIME-Version: 1.0\n",
          "Content-Transfer-Encoding: 7bit\n",
          "to: ",
          to,
          "\n",
          "from: ",
          from,
          "\n",
          "subject: ",
          subject,
          "\n\n",
          message,
        ].join("");

        var encodedMail = new Buffer(str)
          .toString("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_");
        return encodedMail;
      }

      function sendMessage(auth) {
        let thebody = JSON.stringify(items);

        let thenewbody = thebody
          .replace(/{/g, "")
          .replace(/\[/g, "")
          .replace(/}/g, "")
          .replace(/]/g, "")
          .replace(/,/g, " | ")
          .replace(/:/g, " : ")
          .replace(/"/g, "");

        var raw = makeBody(
          "mtmusicandart@gmail.com",
          "",
          "Server Problems",
          `SERVER REPORTED PROBLEMS: ${thenewbody}`
        );
        const gmail = google.gmail({ version: "v1", auth });
        gmail.users.messages.send(
          {
            auth: auth,
            userId: "me",
            resource: {
              raw: raw,
            },
          },
          function (err, response) {
            return err || response;
          }
        );
      }

      fs.readFile(
        "credentials.json",
        function processClientSecrets(err, content) {
          if (err) {
            console.log("Error loading client secret file: " + err);
            return;
          }
          // Authorize a client with the loaded credentials, then call the
          // Gmail API.
          authorize(JSON.parse(content), sendMessage);
        }
      );

      sendMessage();
    } else {
      console.log("no new problems");
    }
  };
};

goTeam();

setInterval(function () {
  var date = new Date(); // Or the date you'd like converted.
  var isoDateTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();

  let timeString = isoDateTime.slice(0, 19).replace("T", " ").replace("Z", "");
  console.log(timeString);

  goTeam();
}, interval);
