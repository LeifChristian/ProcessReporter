// const gmail = require("../gmailAPI/gmailAPI");
var express = require("express");
var router = express.Router();
var axios = require("axios");
const app = express();
const cors = require("cors");
const pm2 = require("pm2");
const corsOpts = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));

const accountSid = "AC6ebe7209c21cd5fbcdb66a63e691737f";
const authToken = "d50704a654d95bd4e1b2f56d34a51329";
const client = require("twilio")(accountSid, authToken);

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", (req, res) => {
  // Form validation

  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);

  var data = JSON.stringify({
    jsonrpc: "2.0",
    method: "user.login",
    params: {
      username: username,
      password: password,
      userData: true,
    },
    id: 1,
  });

  var config = {
    method: "post",
    url: "https://zabbix.unitedlocating.net/api_jsonrpc.php",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/getHosts", (req, res) => {
  console.log(req.body, "body");

  // var axios = require("axios");
  var data = JSON.stringify({
    jsonrpc: "2.0",
    method: "host.get",
    params: {
      output: ["hostid", "host"],
      selectInterfaces: ["interfaceid", "ip"],
    },
    id: 2,
    auth: req.body.sessionID,
  });

  var config = {
    method: "post",
    url: "https://zabbix.unitedlocating.net/api_jsonrpc.php",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/getAlerts", (req, res) => {
  console.log(req.body, "body");

  // var axios = require("axios");
  var data = JSON.stringify({
    jsonrpc: "2.0",
    method: "alert.get",
    params: {
      output: ["hostid", "host"],
      selectInterfaces: ["interfaceid", "ip"],
    },
    id: 2,
    auth: req.body.sessionID,
  });

  var config = {
    method: "post",
    url: "https://zabbix.unitedlocating.net/api_jsonrpc.php",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/getPing", (req, res) => {
  console.log(req.body, "body");

  var axios = require("axios");
  var data = JSON.stringify({
    jsonrpc: "2.0",
    method: "script.execute",
    params: {
      scriptid: "1",
      hostid: "10084",
    },
    auth: req.body.sessionID,
    id: 1,
  });

  var config = {
    method: "post",
    url: "https://zabbix.unitedlocating.net/api_jsonrpc.php",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/getTriggers", (req, res) => {
  console.log(req.body, "body");

  var axios = require("axios");
  var data = JSON.stringify({
    jsonrpc: "2.0",
    method: "trigger.get",
    params: {
      output: ["triggerid", "description", "priority"],
      filter: {
        value: 1,
      },
      sortfield: "priority",
      sortorder: "DESC",
    },
    auth: req.body.sessionID,
    id: 1,
  });

  var config = {
    method: "post",
    url: "https://zabbix.unitedlocating.net/api_jsonrpc.php",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/getProblems", (req, res) => {
  console.log(req.body, "body");

  var axios = require("axios");
  var data = JSON.stringify({
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
    auth: req.body.sessionID,
    id: 2,
  });
  var config = {
    method: "post",
    url: "https://zabbix.unitedlocating.net/api_jsonrpc.php",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.get("/getPM2", async (req, res) => {
  pm2.connect(function (err) {
    pm2.list((err, list) => {
      console.log(err);
      // console.log(err, list);
      // console.log(list[0].monit);
      // console.log(list[0].pm_id);
      // console.log(list[0].pm2_env);

      // console.log(list[0].pm2_env);
      // console.log(list[0].pm2_env.created_at);
      // console.log(list[0].pm2_env.pm_uptime);

      console.log(list);

      let response = [];

      for (let i in list) {
        let item = {
          name: list[i].name,
          process_ID: list[i].pid,
          createdAt: list[i].pm2_env.created_at,
          uptime: list[i].pm2_env.pm_uptime,
          // status: list[i].node_version,
          status: list[i].pm2_env.status,
        };
        response.push(item);
      }

      res.send(response);
    });
  });
});

router.post("/sendText", async (req, res) => {
  console.log(req.body);

  if (req.body.Data) {
    client.messages
      .create({
        body: req.body.Data.replaceAll("[", "")
          .replaceAll("]", "")
          .replaceAll("{", "")
          .replaceAll("}", "")
          .replaceAll(",", " | ")
          .replaceAll('"', " "),
        messagingServiceSid: "MG6a6e4c67fd4bc51cec5f8e1223cad360",
        to: req.body.Number,
      })
      .then((message) => console.log(message.sid))
      .done();
  } else {
    console.log("blank");
  }
});

router.post("/sendEmail", async (req, res) => {
  console.log(req.body);

  if (req.body.Data) {
    // AIzaSyDm7JyQMil4NoXYBUBInJl7V-vemCpoEqQ

    const fs = require("fs");
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
    const TOKEN_PATH = "token.json";

    // Load client secrets from a local file.
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
      const { client_secret, client_id, redirect_uris } = credentials.installed;
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
      var raw = makeBody(
        // req.body.Email ? req.body.Email : "lchristian@unitedlocating.com",
        "Server Status Alert",
        "Server Status Alert",
        req.body.Data
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
    console.log("blank");
  }
});

module.exports = router;
